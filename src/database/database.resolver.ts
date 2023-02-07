import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import get from 'lodash/get';
import { DatabaseService } from './database.service';
import { DatabaseResponse } from './entities/database.entity';

@Resolver()
export class DatabaseResolver {
  constructor(private readonly databaseService: DatabaseService) {}

  // @Mutation(() => Database)
  // createDatabase(@Args('createDatabaseInput') createDatabaseInput: CreateDatabaseInput) {
  //   return this.databaseService.create(createDatabaseInput);
  // }

  @Query(() => DatabaseResponse, { name: 'database' })
  dbById(@Args('id', { type: () => String }) id: string, @Context() context) {
    const headers = get(context, 'req.headers', {});

    const db = this.databaseService.dbById({ id, headers });

    return db;
  }

  @Query(() => [DatabaseResponse], { name: 'databases' })
  getDBs(@Context() context) {
    const headers = get(context, 'req.headers', {});

    return this.databaseService.searchForDbs();
  }

  // @Mutation(() => Database)
  // updateDatabase(
  //   @Args('updateDatabaseInput') updateDatabaseInput: UpdateDatabaseInput,
  // ) {
  //   return this.databaseService.update(
  //     updateDatabaseInput.id,
  //     updateDatabaseInput,
  //   );
  // }

  // @Mutation(() => Database)
  // removeDatabase(@Args('id', { type: () => Int }) id: number) {
  //   return this.databaseService.remove(id);
  // }
}
