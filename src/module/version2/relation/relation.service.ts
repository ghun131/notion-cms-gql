import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { SettingRelationService } from '../setting-relation/setting-relation.service';
import { CreateRecordInput } from './dto/create-record.input';
import { CreateRelationInput } from './dto/create-relation.input';
import { UpdateRecordInput } from './dto/update-record.input';

@Injectable()
export class RelationService {
  dbId: string;
  constructor(
    private notionService: ConnectNotionService,
    private configService: ConfigService,
    private settingRelationService: SettingRelationService,
  ) {
    this.dbId = configService.get<string>('NOTION_MANAGEMENT_USERS_V2_DB_ID');
  }

  async getListRelationsOfUser(pageId: string) {
    const relations = await this.settingRelationService.getListRelationsOfUser(
      pageId,
    );
    return {
      relations: relations.filter(
        (relation) => !relation.name.includes('properties_configuration'),
      ),
    };
  }

  async getListRecordsOfRelation(relationId: string) {
    const result = await this.notionService.notion.databases.query({
      database_id: relationId,
    });

    console.log('result', result);

    return result;
  }

  async createRelation(createRelationInput: CreateRelationInput) {
    const [titleProperty] = createRelationInput.properties.splice(0, 1);
    const otherProperties = createRelationInput.properties.reduce(
      (objProps, prop) => {
        objProps[prop.name] = { rich_text: {}, type: 'rich_text' };

        return objProps;
      },
      {},
    );

    const result = await this.notionService.notion.databases.create({
      parent: {
        page_id: createRelationInput.pageId,
        type: 'page_id',
      },
      title: [
        {
          text: {
            content: createRelationInput.name,
          },
        },
      ],
      properties: {
        [titleProperty.name]: {
          title: {},
          type: 'title',
        },
        ...otherProperties,
      },
    });

    const pageDetail = (await this.notionService.notion.pages.retrieve({
      page_id: createRelationInput.pageId,
    })) as PageObjectResponse;

    const oldRelations =
      pageDetail.properties.relations.type === 'multi_select'
        ? pageDetail.properties.relations.multi_select
        : [];
    await this.notionService.notion.pages.update({
      page_id: createRelationInput.pageId,
      properties: {
        relations: {
          multi_select: [
            ...oldRelations,
            {
              name: `${createRelationInput.name}:${result.id}`,
            },
          ],
        },
      },
    });

    return result;
  }

  async addRecordToRelation(data: CreateRecordInput) {
    try {
      const result = await this.notionService.notion.pages.create({
        parent: {
          database_id: data.relationId,
          type: 'database_id',
        },
        properties: data.properties,
      });

      return result;
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(
        error?.message || 'Something went wrong when add new record',
      );
    }
  }

  async updateRecordToRelation(data: UpdateRecordInput) {
    try {
      const result = await this.notionService.notion.pages.update({
        page_id: data.recordId,
        properties: data.properties,
      });

      return result;
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(
        error?.message || 'Something went wrong when add new record',
      );
    }
  }

  async getInfoRecordToRelation(recordId: string) {
    try {
      const result = await this.notionService.notion.pages.retrieve({
        page_id: recordId,
      });

      return result;
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(
        error?.message || 'Something went wrong when get info record',
      );
    }
  }

  async deleteRecordToRelation(recordId: string) {
    try {
      const result = await this.notionService.notion.pages.update({
        page_id: recordId,
        archived: true,
      });

      return result;
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(
        error?.message || 'Something went wrong when delete record',
      );
    }
  }
}
