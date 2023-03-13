import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { CacheService } from 'src/cache/cache.service';
import { ConnectNotionService } from 'src/connect-notion/connect-notion.service';
import { ConfigPropertiesInput } from './dto/config-properties.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingDatabaseService {
  constructor(
    private readonly notionService: ConnectNotionService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  private getConfigurationsDbId() {
    return this.configService.get(
      'NOTION_MANAGEMENT_PROPERTIES_CONFIGURATION_DB_ID',
    );
  }

  async saveConfigProperties(
    configPropertiesInput: ConfigPropertiesInput,
    clientName: string,
  ) {
    const configurationsDbId = this.getConfigurationsDbId();
    const { results } = await this.notionService.notion.databases.query({
      database_id: configurationsDbId,
      filter: {
        and: [
          {
            property: 'ClientName',
            title: {
              equals: clientName,
            },
          },
          {
            property: 'DatabaseId',
            title: {
              equals: configPropertiesInput.databaseId,
            },
          },
        ],
      },
    });
    const [page] = results;
    const cacheKey = `properties-configuration-${clientName}-${configPropertiesInput.databaseId}`;
    if (!page) {
      // create record as a page
      const newPage = await this.notionService.notion.pages.create({
        parent: {
          database_id: configurationsDbId,
          type: 'database_id',
        },
        properties: {
          ClientName: {
            title: [
              {
                text: {
                  content: clientName,
                },
              },
            ],
          },
          DatabaseId: {
            rich_text: [
              {
                text: {
                  content: configPropertiesInput.databaseId,
                },
              },
            ],
          },
          Configuration: {
            rich_text: [
              {
                text: {
                  content: configPropertiesInput.configuration,
                },
              },
            ],
          },
        },
      });
      this.cacheService.cache.set(cacheKey, newPage);
      console.log('newPage', newPage);
      return newPage;
    }
    // update page
    const updatePage = await this.notionService.notion.pages.update({
      page_id: page.id,
      properties: {
        Configuration: {
          rich_text: [
            {
              text: {
                content: configPropertiesInput.configuration,
              },
            },
          ],
        },
      },
    });
    this.cacheService.cache.set(cacheKey, updatePage);
    console.log('updatePage', updatePage);
    return updatePage;
  }

  async getPropertiesConfiguration(
    databaseId: string,
    clientName: string,
  ): Promise<Partial<PageObjectResponse>> {
    const cacheKey = `properties-configuration-${clientName}-${databaseId}`;
    let configuration = await this.cacheService.cache.get(cacheKey);
    if (configuration) {
      return configuration;
    }

    const { results } = await this.notionService.notion.databases.query({
      database_id: this.getConfigurationsDbId(),
      filter: {
        and: [
          {
            property: 'ClientName',
            title: { equals: clientName },
          },
          {
            property: 'DatabaseId',
            rich_text: { equals: databaseId },
          },
        ],
      },
    });
    configuration = results[0];
    if (configuration) {
      this.cacheService.cache.set(cacheKey, configuration);
    }
    return configuration || {};
  }

  private async getKeysHidden(
    prop: 'listProperties' | 'addProperties' | 'editProperties',
    databaseId: string,
    clientName: string,
  ) {
    const propertiesConfiguration = await this.getPropertiesConfiguration(
      databaseId,
      clientName,
    );
    if (propertiesConfiguration) {
      let hiddenKeysObj: Record<string, any>;
      try {
        hiddenKeysObj = JSON.parse(
          (
            propertiesConfiguration.properties?.Configuration as {
              type: 'rich_text';
              rich_text: any[];
            }
          )?.rich_text?.[0]?.plain_text,
        );
      } catch (error) {
        hiddenKeysObj = {};
      }
      const hiddenKeys = Object.keys(hiddenKeysObj[prop] || {}).reduce(
        (keys, key) => {
          const isHidden = hiddenKeysObj[prop][key]?.hidden;
          if (isHidden) {
            keys.add(key);
          }

          return keys;
        },
        new Set([]),
      );
      return hiddenKeys;
    }
  }

  async filterPropertiesDisplayed(
    data: Array<PageObjectResponse>,
    databaseId: string,
    clientName: string,
  ) {
    const hiddenKeys = await this.getKeysHidden(
      'listProperties',
      databaseId,
      clientName,
    );
    if (!hiddenKeys || !hiddenKeys.size) {
      return data;
    }

    const newData = data.map((item) => {
      for (const prop in item.properties) {
        if (hiddenKeys.has(prop)) {
          delete item.properties[prop];
        }
      }
      return item;
    });
    return newData;
  }

  async filterAddPropertiesObject(
    data: Record<string, any>,
    databaseId: string,
    clientName: string,
  ) {
    const hiddenKeys = await this.getKeysHidden(
      'addProperties',
      databaseId,
      clientName,
    );
    if (!hiddenKeys || !hiddenKeys.size) {
      return data;
    }
    const newObject: Record<string, any> = {};
    for (const prop in data) {
      if (!hiddenKeys.has(prop)) {
        newObject[prop] = data[prop];
      }
    }
    return newObject;
  }

  async filterEditPropertiesObject(
    data: Record<string, any>,
    databaseId: string,
    clientName: string,
  ) {
    const hiddenKeys = await this.getKeysHidden(
      'editProperties',
      databaseId,
      clientName,
    );
    if (!hiddenKeys || !hiddenKeys.size) {
      return data;
    }
    const newObject: Record<string, any> = {};
    for (const prop in data) {
      if (!hiddenKeys.has(prop)) {
        newObject[prop] = data[prop];
      }
    }
    return newObject;
  }
}
