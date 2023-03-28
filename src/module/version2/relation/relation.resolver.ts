import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { CreateRecordInput } from './dto/create-record.input';
import { CreateRelationInput } from './dto/create-relation.input';
import { UpdateRecordInput } from './dto/update-record.input';
import { CreateRecordResult } from './model/create-record.model';
import { CreateRelationResult } from './model/create-relation.model';
import { DetailRelationResult } from './model/detail-relation.model';
import { Record, RecordsResult } from './model/list-records.model';
import { ListRelationsResult } from './model/list-relations.model';
import { UpdateRecordResult } from './model/update-record.model';
import { RelationService } from './relation.service';

// amend authorize
@SkipThrottle()
@Resolver()
export class RelationResolver {
  constructor(private readonly relationService: RelationService) {}

  @Query(() => ListRelationsResult)
  async getListRelationsOfUser(@Args('userId') userId: string) {
    return this.relationService.getListRelationsOfUser(userId);
  }

  @Query(() => RecordsResult)
  async getListRecordsOfRelation(
    @Args('relationId') relationId: string,
    @AuthUser() userId: string,
  ) {
    return this.relationService.getListRecordsOfRelation(relationId, userId);
  }

  @Mutation(() => CreateRelationResult)
  createRelation(
    @Args('createRelationInput') createRelationInput: CreateRelationInput,
    @AuthUser() userId: string,
  ) {
    return this.relationService.createRelation(createRelationInput);
  }

  @Query(() => DetailRelationResult)
  getDetailRelation(
    @Args('relationId') relationId: string,
    @AuthUser() userId: string,
  ) {
    return this.relationService.getDetailRelation(relationId);
  }

  @Mutation(() => CreateRecordResult)
  addRecordToRelation(
    @Args('createRecordInput') createRecordInput: CreateRecordInput,
    @AuthUser() userId: string,
  ) {
    return this.relationService.addRecordToRelation(createRecordInput);
  }

  @Mutation(() => UpdateRecordResult)
  updateRecordToRelation(
    @Args('updateRecordInput') updateRecordInput: UpdateRecordInput,
    @AuthUser() userId: string,
  ) {
    return this.relationService.updateRecordToRelation(updateRecordInput);
  }

  @Query(() => Record)
  async getInfoRecordOfRelation(
    @Args('recordId') recordId: string,
    @AuthUser() userId: string,
  ) {
    return this.relationService.getInfoRecordToRelation(recordId);
  }

  @Mutation(() => UpdateRecordResult)
  deleteRecordToRelation(
    @Args('recordId') recordId: string,
    @AuthUser() userId: string,
  ) {
    return this.relationService.deleteRecordToRelation(recordId);
  }
}
