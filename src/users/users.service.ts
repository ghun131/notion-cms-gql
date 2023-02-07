import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { EnvironmentVariables } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService<EnvironmentVariables>,
    private notionService: ConnectNotionService,
  ) {}

  async users() {
    const users = await this.notionService.notion.users.list({});

    return users;
  }

  async getUserById(id: string) {
    const user = await this.notionService.notion.users.retrieve({
      user_id: id,
    });
    return user;
  }
}
