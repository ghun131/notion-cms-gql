import { BadRequestException, Injectable } from '@nestjs/common';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { CacheService } from '@/cache/cache.service';
import { ConnectNotionService } from '@/connect-notion/connect-notion.service';
import { ConfigPropertiesRelationInput } from '@/module/version2/setting-relation/dto/config-properties.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingRelationService {
  constructor(
    private readonly notionService: ConnectNotionService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async getListRelationsOfUser(pageId: string) {
    try {
      const key = `list-relations-of-user-pageId:${pageId}`;
      let pageDetail: PageObjectResponse = await this.cacheService.cache.get(
        key,
      );
      if (!pageDetail) {
        pageDetail = (await this.notionService.notion.pages.retrieve({
          page_id: pageId,
        })) as PageObjectResponse;
      }

      const relations =
        pageDetail.properties.relations.type === 'multi_select'
          ? pageDetail.properties.relations.multi_select
          : [];
      return relations;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong when get list relations',
      );
    }
  }

  async createPropertiesConfigurationRelation(pageId: string) {
    const result = await this.notionService.notion.databases.create({
      parent: {
        page_id: pageId,
        type: 'page_id',
      },
      title: [
        {
          text: {
            content: 'properties_configuration',
          },
        },
      ],
      properties: {
        user_id: {
          title: {},
          type: 'title',
        },
        relation_name: {
          rich_text: {},
          type: 'rich_text',
        },
        relation_id: {
          rich_text: {},
          type: 'rich_text',
        },
        configuration: {
          rich_text: {},
          type: 'rich_text',
        },
      },
    });

    const pageDetail = (await this.notionService.notion.pages.retrieve({
      page_id: pageId,
    })) as PageObjectResponse;

    const oldRelations =
      pageDetail.properties.relations.type === 'multi_select'
        ? pageDetail.properties.relations.multi_select
        : [];
    await this.notionService.notion.pages.update({
      page_id: pageId,
      properties: {
        relations: {
          multi_select: [
            ...oldRelations,
            {
              name: `properties_configuration:${result.id}`,
            },
          ],
        },
      },
    });

    return result.id;
  }

  private async getConfigurationsDbId(userId: string) {
    const listRelations = await this.getListRelationsOfUser(userId);
    const propertiesConfig = listRelations.find((item) =>
      item.name.includes('properties_configuration'),
    );
    console.log('propertiesConfig', propertiesConfig);
    let configurationsDbId;
    if (!propertiesConfig) {
      configurationsDbId = await this.createPropertiesConfigurationRelation(
        userId,
      );
    } else {
      configurationsDbId = propertiesConfig.name.split(':')[1];
    }
    return configurationsDbId;
  }

  async getConfigurationById(configId: string) {
    const key = `configuration-id-${configId}`;
    const configCached: PageObjectResponse = await this.cacheService.cache.get(
      key,
    );
    if (configCached) {
      return configCached;
    }
    const config = await this.notionService.notion.pages.retrieve({
      page_id: configId,
    });
    this.cacheService.cache.set(key, config);

    return config as PageObjectResponse;
  }

  async saveConfigProperties(
    configPropertiesInput: ConfigPropertiesRelationInput,
    userId: string,
    options: {
      replaceOldConfiguration: boolean;
    } = {
      replaceOldConfiguration: true,
    },
  ) {
    const configurationsDbId = await this.getConfigurationsDbId(userId);
    const { results } = await this.notionService.notion.databases.query({
      database_id: configurationsDbId,
      filter: {
        and: [
          {
            property: 'user_id',
            title: {
              equals: userId,
            },
          },
          {
            property: 'relation_id',
            title: {
              equals: configPropertiesInput.relationId,
            },
          },
        ],
      },
    });
    const [page] = results as PageObjectResponse[];
    const cacheKey = `properties-configuration-${userId}-${configPropertiesInput.relationId}`;
    if (!page) {
      // create record as a page
      const newPage = await this.notionService.notion.pages.create({
        parent: {
          database_id: configurationsDbId,
          type: 'database_id',
        },
        properties: {
          user_id: {
            title: [
              {
                text: {
                  content: userId,
                },
              },
            ],
          },
          relation_name: {
            rich_text: [
              {
                text: {
                  content: configPropertiesInput.relationName,
                },
              },
            ],
          },
          relation_id: {
            rich_text: [
              {
                text: {
                  content: configPropertiesInput.relationId,
                },
              },
            ],
          },
          configuration: {
            rich_text: [
              {
                text: {
                  content: JSON.stringify(configPropertiesInput.configuration),
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
    let newConfiguration;
    if (options?.replaceOldConfiguration) {
      newConfiguration = configPropertiesInput.configuration;
    } else {
      let oldConfig = {};
      try {
        const config =
          page.properties.configuration.type === 'rich_text'
            ? page.properties.configuration.rich_text?.[0]?.plain_text
            : '{}';
        oldConfig = JSON.parse(config);
      } catch (error) {}
      const objNewConfig = configPropertiesInput.configuration;
      newConfiguration = { ...oldConfig, ...objNewConfig };
    }
    const updatePage = await this.notionService.notion.pages.update({
      page_id: page.id,
      properties: {
        configuration: {
          rich_text: [
            {
              text: {
                content: JSON.stringify(newConfiguration),
              },
            },
          ],
        },
      },
    });
    this.cacheService.cache.set(cacheKey, updatePage);
    this.cacheService.cache.del(`configuration-id-${updatePage.id}`);
    console.log('updatePage', updatePage);
    return updatePage;
  }

  async getPropertiesConfiguration(
    relationId: string,
    userId: string,
  ): Promise<{
    property_names: string[];
    property_details: Record<string, any>;
    configuration: Partial<PageObjectResponse>;
  }> {
    const db = await this.notionService.notion.databases.retrieve({
      database_id: relationId,
    });
    const property_names = Object.keys(db.properties);
    const cacheKey = `properties-configuration-${userId}-${relationId}`;
    let configuration = await this.cacheService.cache.get(cacheKey);
    if (configuration) {
      return {
        configuration,
        property_names: property_names,
        property_details: db.properties,
      };
    }

    const { results } = await this.notionService.notion.databases.query({
      database_id: await this.getConfigurationsDbId(userId),
      filter: {
        and: [
          {
            property: 'user_id',
            title: { equals: userId },
          },
          {
            property: 'relation_id',
            rich_text: { equals: relationId },
          },
        ],
      },
    });
    configuration = results[0];
    console.log(configuration);
    if (configuration) {
      this.cacheService.cache.set(cacheKey, configuration);
    }
    return {
      property_names: property_names,
      property_details: db.properties,
      configuration: configuration || {},
    };
  }

  private async getKeysHidden(
    prop: 'listProperties' | 'addProperties' | 'editProperties',
    relationId: string,
    userId: string,
  ) {
    const propertiesConfiguration = (
      await this.getPropertiesConfiguration(relationId, userId)
    ).configuration;
    if (propertiesConfiguration) {
      let hiddenKeysObj: Record<string, any>;
      try {
        hiddenKeysObj = JSON.parse(
          (
            propertiesConfiguration.properties?.configuration as {
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
    relationId: string,
    userId: string,
  ) {
    const hiddenKeys = await this.getKeysHidden(
      'listProperties',
      relationId,
      userId,
    );
    console.log('hiddenKeys', hiddenKeys);
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
    relationId: string,
    userId: string,
  ) {
    const hiddenKeys = await this.getKeysHidden(
      'addProperties',
      relationId,
      userId,
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
    relationId: string,
    userId: string,
  ) {
    const hiddenKeys = await this.getKeysHidden(
      'editProperties',
      relationId,
      userId,
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
