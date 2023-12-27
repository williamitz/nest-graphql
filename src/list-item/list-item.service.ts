import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { handlerError } from '../common/helpers/handler-error.helper';
import { ListItemsResponse } from './types/list-items-response.type';
import { QueryFilterArgs } from '../common/args/query-filter.arg';
import { onSkipCalc } from '../common/helpers/utils.helper';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository( ListItem )
    private readonly _listItemRepo: Repository<ListItem>
  ){}

  async create( createListItemInput: CreateListItemInput ): Promise<ListItem> {
    
    try {

      const { listId, itemId, ...body } = createListItemInput;

      const newRecord = this._listItemRepo.create({
        ...body,
        list: { id: listId },
        item: { id: itemId }
      });

      await this._listItemRepo.save( newRecord );

      return await this.findOne( newRecord.id );

    } catch (error) {
      handlerError( error )
    }
      
  }

  findAll() {
    return `This action returns all listItem`;
  }

  async findAllByListId( listId: string, queryArgs: QueryFilterArgs ): Promise<ListItemsResponse> {
    
    try {
      
      const { page = 0, rowsForPage, isActive = true, filter = '' } = queryArgs;


      const queryOpt: FindManyOptions<ListItem> = {};
      
      let where: FindOptionsWhere<ListItem> = {
        list: {
          id: listId
        }
      };

      // if( filter && filter != '' )
      //   where.name = ILike(`%${ filter }%`);
      
      if( page && page > 0 ) {

        const skip = onSkipCalc( page, rowsForPage );

        queryOpt.skip = skip;
        queryOpt.take = rowsForPage;
        
      }

      queryOpt.where = where;

      const [ data, total ] = await Promise.all([
        this._listItemRepo.find( queryOpt ),
        this._listItemRepo.count( { where: queryOpt.where } )
      ]);
      
      return {
        listItems: data,
        total
      };

    } catch (error) {
      handlerError( error );  
    }

  }

  async findOne( id: string ) {
    
    try {

      const listById = await this._listItemRepo.findOneBy({ id });

      if( !listById ) throw new NotFoundException(`Not found list by id #${ id }`);

      return listById;
      
    } catch (error) {
      handlerError( error );
    }

  }

  async update( listItemId: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    
    try {

      // TODO: Esta forma de actualizar no esa mal en una crud
      // pero para tablas intermedias mejor querybuilder
      
      const { listId, itemId, id , ...body } = updateListItemInput;

      const queryBuilder = this._listItemRepo.createQueryBuilder()
                          .update()
                          .set({ ...body })
                          .where('id = :id', { id });
      
      if( listId ) queryBuilder.set({ list: { id: listId } });
      if( itemId ) queryBuilder.set({ item: { id: itemId } });

      // const listItem = await this._listItemRepo.preload({
      //   ...body,
      //   list: { id: listId },
      //   item: { id: itemId }
      // });

      // if( !listItem ) throw new NotFoundException(`Not found list by id #${ id }`);

      // return await this._listItemRepo.save( listItem );

      await queryBuilder.execute();

      return await this.findOne( id );
      
    } catch (error) {
      handlerError( error );
    }
    
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
