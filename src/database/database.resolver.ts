import get from 'lodash/get';

import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { DatabaseService } from './database.service';
import { Database, DatabaseResponse } from './entities/database.entity';
import { CreateDatabaseInput } from './dto/create-database.input';
import { UpdateDatabaseInput } from './dto/update-database.input';
import { SkipThrottle } from '@nestjs/throttler';

@Resolver()
@SkipThrottle()
export class DatabaseResolver {
  constructor(private readonly databaseService: DatabaseService) {}

  @Mutation(() => Database, {
    name: 'create_database',
    description:
      'Create one database, more detail in https://developers.notion.com/reference/create-a-database',
  })
  createDatabase(
    @Args('createDatabaseInput') createDatabaseInput: CreateDatabaseInput,
    @Context() context,
  ) {
    const clientName = get(context, 'req.headers.notionclientname', '');

    return this.databaseService.create(createDatabaseInput, clientName);
  }

  @Query(() => Database, {
    name: 'retrieve_database',
    description:
      'Get context of one database like title, cover, header name, etc...',
  })
  getDbContext(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
  ) {
    const headers = get(context, 'req.headers', {});

    const db = this.databaseService.getDbContext({ id, headers });

    return db;
  }

  @Query(() => DatabaseResponse, {
    name: 'one_database',
    description: 'Get data of one db',
  })
  dbById(@Args('id', { type: () => String }) id: string, @Context() context) {
    const headers = get(context, 'req.headers', {});

    const db = this.databaseService.dbById({ id, headers });

    return db;
  }

  @Query(() => DatabaseResponse, {
    name: 'databases',
    description: 'List all databases are added to integration',
  })
  getDBs(@Context() context) {
    const headers = get(context, 'req.headers', {});

    return this.databaseService.searchForDbs(headers);
  }

  @Mutation(() => Database, {
    name: 'update_database',
    description:
      'It changes database column, more info at https://developers.notion.com/reference/update-a-database',
  })
  updateDatabase(
    @Args('updateDatabaseInput') updateDatabaseInput: UpdateDatabaseInput,
    @Context() context,
  ) {
    const clientName = get(context, 'req.headers.notionclientname', '');

    return this.databaseService.update(
      updateDatabaseInput.id,
      updateDatabaseInput,
      clientName,
    );
  }

  // @Mutation(() => Database)
  // removeDatabase(@Args('id', { type: () => Int }) id: number) {
  //   return this.databaseService.remove(id);
  // }
}
