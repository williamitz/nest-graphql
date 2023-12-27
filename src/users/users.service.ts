import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ArrayContainedBy, FindOptionsWhere, ILike, Like, Repository, FindManyOptions } from 'typeorm';
import { v4, validate as IsUUID } from 'uuid';

import { UpdateUserInput } from './dto/inputs/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SingupInput } from '../auth/dto/inputs';
import { emailPatt } from 'src/common/helpers/regexp.helper';
import { handlerError } from '../common/helpers/handler-error.helper';
import { FiltersUserArgs } from './dto/args/filter-user.arg';
import { UserListResponse } from './types/user-response.type';
import { ItemsService } from '../items/items.service';
import { QueryFilterArgs } from '../common/args/query-filter.arg';
import { onSkipCalc } from '../common/helpers/utils.helper';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository( User )
    private readonly _userRepo: Repository<User>,

    private readonly _itemsSvc: ItemsService
) {}

  async create( singupInput: SingupInput ): Promise<User> {
    try {

      const { passwordUser, ...body } = singupInput;

      const userPre = this._userRepo.create({
          ...body,
          password: this._onEncriptPassword( passwordUser )
      });

      const newUser = await this._userRepo.save( userPre );

      return newUser;
      
    } catch (error) {
      handlerError(error, 'Error al crear usuario');
    }
  }

  private _onEncriptPassword( password: string ): string {
    return bcrypt.hashSync( password, 10 );
  }

  async findAll( filters: FiltersUserArgs ): Promise<UserListResponse> {
    
    try {

      const { roles, filter = '', page = 0, rowsForPage = 100, isActive = true } = filters;

      const findOpt: FindManyOptions = {};

      let where: FindOptionsWhere<User> = {
        isActive,
      };
      
      if( page && page > 0 ) {
        
        const skip = onSkipCalc( page, rowsForPage );

        findOpt.skip = skip;
        findOpt.take = rowsForPage;

      }


      if( roles.length > 0 )
        where.roles = ArrayContainedBy( roles );
      
      if( filter && filter != '' )
        where.fullName = ILike(`%${ filter }%`);

      findOpt.where = where;

      console.log('findOpt ::: ', findOpt);

      const [ users, total ] = await Promise.all([
        
        this._userRepo.find( findOpt ),

        this._userRepo.count( { where } )
        
      ]);
      
      return {
        users,
        total
      };

    } catch (error) {
      handlerError( error )
    }

  }

  async findOne( pattern: string ): Promise<User> {
    
    try {

      let where: FindOptionsWhere<User> = {};

      if( emailPatt.exec( pattern ) )
        where.email = Like( pattern );
      if( IsUUID(pattern) )
        where.id = pattern;

      const user = await this._userRepo.findOne( { where });

      if( !user ) throw new NotFoundException(`User by id #${ pattern } not found`);

      return user;
      
    } catch (error) {
      handlerError(error, 'Error al buscar usuario');
    }

  }

  async update( id: string, updateUserInput: UpdateUserInput, userUpdated: User ): Promise<User> {
    
    try {

      const user = await this._userRepo.preload({
        id,
        ...updateUserInput,
        lastUpdateBy: userUpdated
      });

      if( !user )
        throw new NotFoundException(`User by id #${ id } not found`);
        
      return await this._userRepo.save( user );
      
    } catch (error) {
      handlerError( error );
    }

  }

  async itemsForUser( user: User, queryArgs: QueryFilterArgs ) {
    return this._itemsSvc.findAll( user, queryArgs );
  }

  async itemsCount( user: User ): Promise<number> {
    return this._itemsSvc.itemsCountByUser( user );
  }

  async block( id: string, user: User ): Promise<User> {
    
    const userToBloc = await this.findOne( id );
    
    userToBloc.isActive = false;
    userToBloc.lastUpdateBy = user;

    return await this._userRepo.save( userToBloc );

  }
}
