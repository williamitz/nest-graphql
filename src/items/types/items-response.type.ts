import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Item } from '../entities/item.entity';

@ObjectType()
export class ItemsListResponse {
    
    @Field( () => [Item], { name: 'items', description: 'List to items' } )
    items: Item[];
    
    @Field( () => Int, { name: 'total', description: 'Total records' } )
    total: number;

}