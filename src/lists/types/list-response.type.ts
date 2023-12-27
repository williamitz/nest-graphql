import { Field, Int, ObjectType } from '@nestjs/graphql';
import { List } from '../entities/list.entity';

@ObjectType()
export class ListResponse {

    @Field( () => [List], { name: 'lists' } )
    lists: List[];

    @Field( () => Int, { name: 'total' } )
    total: number;

}