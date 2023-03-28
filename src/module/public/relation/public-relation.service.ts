import { RelationService } from '@/module/version2/relation/relation.service';
import { SettingRelationService } from '@/module/version2/setting-relation/setting-relation.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class PublicRelationService {
  constructor(
    private settingRelationService: SettingRelationService,
    private relationService: RelationService,
    private cacheService: CacheService,
  ) {}

  async getListActiveRecordOfRelation(configId: string, relationId: string) {
    try {
      const config = await this.settingRelationService.getConfigurationById(
        configId,
      );
      const configuration = JSON.parse(
        config.properties.configuration.type === 'rich_text'
          ? config.properties.configuration.rich_text?.[0]?.plain_text
          : '{}',
      );
      if (!configuration.publicApi?.publicApiListRecordActiveOfRelation) {
        throw new NotFoundException();
      }
      const key = `public-api-records-relation-${configId}-${relationId}`;
      let results: any[] = await this.cacheService.cache.get(key);
      if (!results) {
        const data = await this.relationService.getListRecordsOfRelation(
          relationId,
        );
        if (data.results.length) {
          this.cacheService.cache.set(key, data.results);
          results = data.results;
        }
      }
      results = results.map((item) => {
        const output: Record<string, any> = {
          id: item.id,
          created_time: item.created_time,
        };
        for (const prop in item.properties) {
          output[prop] =
            item.properties[prop]?.rich_text?.[0]?.plain_text ||
            item.properties[prop]?.title?.[0]?.plain_text;
        }

        return output;
      });

      return results;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getDetailActiveRecordOfRelation(
    configId: string,
    relationId: string,
    recordId: string,
  ) {
    try {
      const config = await this.settingRelationService.getConfigurationById(
        configId,
      );
      const configuration = JSON.parse(
        config.properties.configuration.type === 'rich_text'
          ? config.properties.configuration.rich_text?.[0]?.plain_text
          : '{}',
      );
      if (!configuration.publicApi?.publicApiDetailRecordActiveOfRelation) {
        throw new NotFoundException();
      }
      const key = `public-api-detail-record-relation-${configId}-${relationId}`;
      let result: Record<string, any> = await this.cacheService.cache.get(key);
      if (!result) {
        result = await this.relationService.getInfoRecordToRelation(recordId);
        this.cacheService.cache.set(key, result);
      }
      const output: Record<string, any> = {
        id: result.id,
        created_time: result.created_time,
      };
      for (const prop in result.properties) {
        output[prop] =
          result.properties[prop]?.rich_text?.[0]?.plain_text ||
          result.properties[prop]?.title?.[0]?.plain_text;
      }

      return output;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
