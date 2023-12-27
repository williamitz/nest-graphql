import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { QueryFilterArgs } from '../common/args/query-filter.arg';
import { onSkipCalc } from 'src/common/helpers/utils.helper';
import { ItemsListResponse } from './types/items-response.type';
import { handlerError } from '../common/helpers/handler-error.helper';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly _itemRepo: Repository<Item>
  ){}

  async create( createItemInput: CreateItemInput, user: User ): Promise<Item> {
    try {

      const itemPre = this._itemRepo.create({
        ...createItemInput,
        user
      });

      const newItem = await this._itemRepo.save( itemPre );

      return newItem;
      
    } catch (error) {
      
      throw new BadRequestException('Error el crear item')

    }
  }

  async findAll( user: User, queryArgs: QueryFilterArgs ): Promise<ItemsListResponse> {
    try {

      const { page = 0, rowsForPage, isActive = true, filter = '' } = queryArgs;

      const queryOpt: FindManyOptions<Item> = {};
      
      let where: FindOptionsWhere<Item> = {
        user: {
          id: user.id
        }
      };

      if( filter && filter != '' )
        where.name = ILike(`%${ filter }%`);
      
      if( page && page > 0 ) {

        const skip = onSkipCalc( page, rowsForPage );

        queryOpt.skip = skip;
        queryOpt.take = rowsForPage;
        
      }

      queryOpt.where = where;

      const [items, total] = await Promise.all([
        this._itemRepo.find( queryOpt ),
        this._itemRepo.count( { where } )
      ]);

      return {
        items,
        total
      };
      
    } catch (error) {
      throw new BadRequestException('Error el crear item')
    }
  }

  async findOne( id: string, user: User ): Promise<Item> {
    try {

      const item = await this._itemRepo.findOne({
        where: {
          id,
          user: {
            id: user.id
          }
        }
      });

      if( !item ) throw new NotFoundException(`No se encontró item con id #${ id }`);

      return item;
      
    } catch (error) {
      handlerError( error );
    }
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User ): Promise<Item> {
    
    try {

      const item = await this.findOne( id, user )

      const itemPre = await this._itemRepo.preload({
        id,
        ...updateItemInput,
      });

      if( !itemPre ) throw new NotFoundException(`No se encontró item con id #${ id }`);

      const newItem = await this._itemRepo.save( itemPre );

      return newItem;
      
    } catch (error) {
      
      handlerError( error );

    }
    
  }

  async itemsCountByUser( user: User ): Promise<number> {
    
    return await this._itemRepo.count({
      where: {
        user: { id: user.id }
      }
    });

  }

  async remove( id: string, user: User ): Promise<string> {
    
    try {

      const item = await this.findOne( id, user );

      await this._itemRepo.remove( item );

      return `This action removes a #${id} item`;
      
    } catch (error) {
      
      handlerError( error );

    }

  }
}
