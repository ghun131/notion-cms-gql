import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { SearchParameters } from '@notionhq/client/build/src/api-endpoints';
import get from 'lodash/get';
import { SearchInput } from './search.input';
import { SearchResponse } from './search.model';
import { SearchService } from './search.service';

@Resolver()
export class SearchResolver {
  constructor(private searchService: SearchService) {}
  @Query(() => SearchResponse, {
    name: 'search',
    description: 'Search databases and pages',
  })
  search(@Args('searchInput') searchInput: SearchInput, @Context() context) {
    const headers = get(context, 'req.headers', {});

    return this.searchService.search(searchInput as SearchParameters, headers);
  }
}
