import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ListItem } from '../entities/list-item.entity';

@ObjectType()
export class ListItemsResponse {

    @Field( () => [ListItem] )
    listItems: ListItem[];
    
    @Field( () => Int )
    total: number;
    
}