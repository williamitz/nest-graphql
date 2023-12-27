import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { JwtUser } from '../auth/decorators/jwt-user.decorator';
import { User } from '../users/entities/user.entity';
import { QueryFilterArgs } from '../common/args/query-filter.arg';
import { ListResponse } from './types/list-response.type';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemsResponse } from '../list-item/types/list-items-response.type';
import { ListItemService } from '../list-item/list-item.service';

@UseGuards( JwtAuthGuard )
@Resolver(() => List)
export class ListsResolver {

  constructor(
    private readonly listsService: ListsService,
    private readonly _listItemSvc: ListItemService
  ) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @JwtUser() user: User
  ) {
    return this.listsService.create( createListInput, user );
  }

  @Query(() => ListResponse, { name: 'lists' })
  findAll(
    @JwtUser() user: User,
    @Args() queryFilter: QueryFilterArgs
  ): Promise<ListResponse> {
    return this.listsService.findAll( queryFilter, user );
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @JwtUser() user: User
  ) {
    return this.listsService.findOne( id, user );
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @JwtUser() user: User
  ) {
    return this.listsService.update( updateListInput.id, updateListInput, user );
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @JwtUser() user: User
  ) {
    return this.listsService.remove( id, user );
  }

  @ResolveField( () => ListItemsResponse )
  async listItems(
    @Parent() list: List,
    @Args() queryArgs: QueryFilterArgs
  ): Promise<ListItemsResponse> {
    return this._listItemSvc.findAllByListId( list.id, queryArgs );
  }
}
