import { ObjectType } from '@nestjs/graphql';
import { NotionObjectResponse } from 'src/common/models/notion-object-response.model';

@ObjectType()
export class PropertiesConfiguration extends NotionObjectResponse {}
