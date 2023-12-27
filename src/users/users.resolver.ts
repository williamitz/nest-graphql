import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { FiltersUserArgs } from './dto/args/filter-user.arg';
import { UserListResponse } from './types/user-response.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtUser } from 'src/auth/decorators/jwt-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Item } from '../items/entities/item.entity';
import { QueryFilterArgs } from '../common/args/query-filter.arg';
import { ItemsListResponse } from '../items/types/items-response.type';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';
import { ListResponse } from '../lists/types/list-response.type';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {

  constructor(
    private readonly usersService: UsersService,
    private readonly listService: ListsService
  ) {}

  @Query(() => UserListResponse, { name: 'users' })
  findAll(
    @Args() filtersUserArgs: FiltersUserArgs,
    @JwtUser( [ValidRoles.superUser] ) user: User
  ): Promise<UserListResponse> {

    return this.usersService.findAll( filtersUserArgs );

  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @JwtUser( [ValidRoles.admin, ValidRoles.superUser] ) user: User
  ) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser( 
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @JwtUser( [ValidRoles.admin, ValidRoles.superUser] ) user: User
  ): Promise<User> {
    return this.usersService.update( updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @JwtUser( [ValidRoles.admin, ValidRoles.superUser] ) user: User
  ): Promise<User> {
    return this.usersService.block( id, user );
  }

  @ResolveField( () => Int )
  async itemCount(
    @Parent() user: User,
    @JwtUser( [ValidRoles.admin, ValidRoles.superUser] ) userJwt: User
  ): Promise<number> {
    return this.usersService.itemsCount( user );
  }

  @ResolveField( () => ItemsListResponse, { name: 'itemsForUser' } )
  async items(
    @Parent() user: User,
    @JwtUser( [ValidRoles.admin, ValidRoles.superUser] ) userJwt: User,
    @Args() queryArgs: QueryFilterArgs ,
  ): Promise<ItemsListResponse> {
    return this.usersService.itemsForUser( user, queryArgs );
  }
  
  @ResolveField( () => ListResponse, { name: 'listForUser' } )
  async listByUser(
    @Parent() user: User,
    @JwtUser( [ValidRoles.admin, ValidRoles.superUser] ) userJwt: User,
    @Args() queryArgs: QueryFilterArgs ,
  ): Promise<ListResponse> {
    
    return this.listService.findAll( queryArgs, user );

  }

}
