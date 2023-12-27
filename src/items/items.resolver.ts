import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '../auth/decorators/jwt-user.decorator';
import { User } from '../users/entities/user.entity';
import { QueryFilterArgs } from '../common/args/query-filter.arg';
import { ItemsListResponse } from './types/items-response.type';

@Resolver(() => Item)
@UseGuards(  JwtAuthGuard )
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItemInput' })
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @JwtUser() user: User
  ): Promise<Item> {
    return this.itemsService.create( createItemInput, user );
  }

  @Query(() => ItemsListResponse, { name: 'items' })
  findAll(
    
    @Args() queryArgs: QueryFilterArgs,
    @JwtUser() user: User

  ): Promise<ItemsListResponse> {
    return this.itemsService.findAll( user, queryArgs );
  }

  @Query(() => Item, { name: 'item' })
  findOne( 
    @Args('id', { type: () => ID, }, ParseUUIDPipe ) id: string,
    @JwtUser() user: User
  ): Promise<Item> {
    return this.itemsService.findOne( id, user );
  }

  @Mutation(() => Item, { name: 'updateItem' })
  updateItem(
    @Args('id', { type: () => ID, name: 'id' }, ParseUUIDPipe ) id: string,
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @JwtUser() user: User
  ) {
    return this.itemsService.update( id, updateItemInput, user );
  }

  @Mutation(() => String)
  removeItem(
    @Args('id', { type: () => String }) id: string,
    @JwtUser() user: User
  ): Promise<string> {
    return this.itemsService.remove( id, user );
  }
}
