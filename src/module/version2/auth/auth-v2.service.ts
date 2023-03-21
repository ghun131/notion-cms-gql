import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpUserV2Input } from './dto/sign-up-user-v2.input';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { SignInUserV2Input } from './dto/sign-in-user-v2.input';
import { randomCode } from 'src/libs/random-code';
import { VerifyUserV2Input } from './dto/verify-user-v2.input';
import { USER_STATUS } from './const/user-status';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
@Injectable()
export class AuthV2Service {
  dbId: string;
  constructor(
    private notionService: ConnectNotionService,
    private configService: ConfigService,
  ) {
    this.dbId = configService.get<string>('NOTION_MANAGEMENT_USERS_V2_DB_ID');
  }

  async signUp(data: SignUpUserV2Input) {
    const { results } = await this.notionService.notion.databases.query({
      database_id: this.dbId,
      filter: {
        and: [
          {
            property: 'email',
            title: {
              equals: data.email,
            },
          },
        ],
      },
    });

    if (results?.length) {
      throw new BadRequestException('Email has already exist');
    }
    // should be hashed password
    // should be send code to email

    await this.notionService.notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: this.dbId,
      },
      properties: {
        email: {
          title: [
            {
              text: {
                content: data.email,
              },
            },
          ],
        },
        password: {
          rich_text: [
            {
              text: {
                content: data.password,
              },
            },
          ],
        },
        verify_code: {
          rich_text: [
            {
              text: {
                content: randomCode(),
              },
            },
          ],
        },
      },
    });

    return { success: true };
  }

  async verifyUser(data: VerifyUserV2Input) {
    try {
      const { results } = await this.notionService.notion.databases.query({
        database_id: this.dbId,
        filter: {
          and: [
            {
              property: 'email',
              title: {
                equals: data.email,
              },
            },
            {
              property: 'verify_code',
              title: {
                equals: data.code,
              },
            },
          ],
        },
      });
      const [exist] = results as Array<PageObjectResponse>;
      if (!exist) {
        throw new NotFoundException('Email or code incorrect');
      }
      if (
        exist.properties.status.type === 'status' &&
        exist.properties.status.status.name === USER_STATUS.active
      ) {
        throw new BadRequestException('Email was activated');
      }

      const { id, object } = await this.notionService.notion.pages.update({
        page_id: exist.id,
        properties: {
          status: {
            status: {
              name: USER_STATUS.active,
            },
          },
          activated_at: {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      });

      return {
        id,
        object,
      };
    } catch (error) {
      throw new NotFoundException(error.message || 'Email or code incorrect');
    }
  }

  async signIn(data: SignInUserV2Input) {
    try {
      const { results } = await this.notionService.notion.databases.query({
        database_id: this.dbId,
        filter: {
          and: [
            {
              property: 'email',
              title: {
                equals: data.email,
              },
            },
            {
              property: 'password',
              title: {
                equals: data.password, // should be hashed
              },
            },
            {
              property: 'status',
              status: {
                equals: USER_STATUS.active,
              },
            },
          ],
        },
      });
      const [exist] = results;
      if (!exist) {
        throw new NotFoundException('Email or password incorrect');
      }
      return {
        ...exist,
        accessToken: 'ylRNtDpvMqAQsCOEVrQFlf5GCaBTGFkZ',
      };
      // amend jwt
    } catch (error) {
      throw new NotFoundException('Email or password incorrect');
    }
  }
}
