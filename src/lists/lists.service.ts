import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';

import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { List } from './entities/list.entity';
import { handlerError } from '../common/helpers/handler-error.helper';
import { User } from '../users/entities/user.entity';
import { QueryFilterArgs } from '../common/args/query-filter.arg';
import { onSkipCalc } from '../common/helpers/utils.helper';
import { ListResponse } from './types/list-response.type';

@Injectable()
export class ListsService {
  
  constructor(
    @InjectRepository( List )
    private readonly _listRepo: Repository<List>
  ){}

  async create( createListInput: CreateListInput, user: User ): Promise<List> {
    try {

      const listPre = this._listRepo.create({
        ...createListInput,
        user: user
      });

      return await this._listRepo.save( listPre );

    } catch (error) {
      handlerError( error );
    }
  }

  async findAll( filters: QueryFilterArgs, user: User ): Promise<ListResponse> {
    try {
      
      const { page = 0, rowsForPage = 5, filter = '' } = filters;

      const findOpts: FindManyOptions<List> = {};
      const where: FindOptionsWhere<List> = {
        user: {
          id: user.id
        }
      };

      if( page && page > 0 ) {
        
        const skip = onSkipCalc( page, rowsForPage );

        findOpts.skip = skip;
        findOpts.take = rowsForPage;

      }

      if( filter && filter != '' ) {
        where.name = ILike(`%${ filter }%`);
      }

      findOpts.where = where;

      const [ lists, total ] = await Promise.all([
        
        this._listRepo.find( findOpts ),
        this._listRepo.count( { where } )

      ]);

      return {
        lists,
        total
      };
      
    } catch (error) {
      handlerError( error );
    }
  }

  async findOne( id: string, user: User ): Promise<List> {
    
    try {

      const list = await this._listRepo.findOneBy({ id, user: { id: user.id } });

      if( !list ) throw new NotFoundException(`Not found list by id #${ id }`);

      return list;

    } catch (error) {
      handlerError( error );
    }
    
  }

  async update( id: string, updateListInput: UpdateListInput, user: User ): Promise<List> {
    
    try {

      await this.findOne( id, user );

      const listPre = await this._listRepo.preload({
        id,
        ...updateListInput,
        user: user
      });

      return await this._listRepo.save( listPre );
      
    } catch (error) {
      handlerError( error );
    }

  }

  async remove( id: string, user: User ):Promise<List> {
    try {
      
      const list = await this.findOne( id, user );

      await this._listRepo.remove( list );

      return list;

    } catch (error) {
      handlerError( error );
    }
  }
}
