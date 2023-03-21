import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '@/module/version2/auth/decorator/auth-user.decorator';
import { ConfigPropertiesRelationInput } from '@/module/version2/setting-relation/dto/config-properties.dto';
import { ConfigPropertiesRelation } from '@/module/version2/setting-relation/models/config-properties.model';
import { PropertiesConfigRelation } from '@/module/version2/setting-relation/models/properties-configuration.model';
import { SettingRelationService } from '@/module/version2/setting-relation/setting-relation.service';

@Resolver()
export class SettingRelationResolver {
  constructor(
    private readonly settingRelationService: SettingRelationService,
  ) {}

  @Mutation(() => ConfigPropertiesRelation)
  configPropertiesRelation(
    @Args('configPropertiesRelationInput')
    configPropertiesRelationInput: ConfigPropertiesRelationInput,
    @AuthUser() userId: string,
  ): Promise<ConfigPropertiesRelation> {
    return this.settingRelationService.saveConfigProperties(
      configPropertiesRelationInput,
      userId,
    );
  }

  @Query(() => PropertiesConfigRelation)
  async getPropertiesConfigOfRelation(
    @Args('relationId') relationId: string,
    @AuthUser() userId: string,
  ) {
    return this.settingRelationService.getPropertiesConfiguration(
      relationId,
      userId,
    );
  }
}
