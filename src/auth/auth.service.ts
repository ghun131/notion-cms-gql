import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminDatabaseService } from '../admin-database/admin-database.service';
import { ConnectNotionService } from '../connect-notion/connect-notion.service';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private adminDatabaseService: AdminDatabaseService,
    private notionService: ConnectNotionService,
  ) {}

  async createUser(data: CreateUserInput) {
    const db = await this.adminDatabaseService.getAdminDatabase();
    const { results } = await this.notionService.notion.search({
      filter: {
        value: 'page',
        property: 'object',
      },
      query: data.userName,
    });
    if (results?.length) {
      throw new BadRequestException('User Name has already exist');
    }

    return await this.notionService.notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: db.id,
      },
      properties: {
        secret: {
          rich_text: [
            {
              text: {
                content: data.secretKey,
              },
            },
          ],
        },
        Name: {
          title: [
            {
              text: {
                content: data.userName,
              },
            },
          ],
        },
      },
    });
  }
}
