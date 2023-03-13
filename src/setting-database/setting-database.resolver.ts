import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';
import { ConfigPropertiesInput } from './dto/config-properties.dto';
import { ConfigProperties } from './models/config-properties.model';
import { PropertiesConfiguration } from './models/properties-configuration.model';
import { SettingDatabaseService } from './setting-database.service';

@Resolver()
export class SettingDatabaseResolver {
  constructor(
    private readonly settingDatabaseService: SettingDatabaseService,
  ) {}

  @Mutation(() => ConfigProperties)
  configProperties(
    @Args('configPropertiesInput') configPropertiesInput: ConfigPropertiesInput,
    @AuthUser() clientName: string,
  ): Promise<ConfigProperties> {
    return this.settingDatabaseService.saveConfigProperties(
      configPropertiesInput,
      clientName,
    );
  }

  @Query(() => PropertiesConfiguration)
  async getPropertiesConfiguration(
    @Args('databaseId') databaseId: string,
    @AuthUser() clientName: string,
  ) {
    return this.settingDatabaseService.getPropertiesConfiguration(
      databaseId,
      clientName,
    );
  }
}
