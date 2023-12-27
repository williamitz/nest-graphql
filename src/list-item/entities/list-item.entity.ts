import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Item } from '../../items/entities/item.entity';

@Entity({ name: 'listItems' })
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  
  @Column({
    type: 'numeric'
  })
  @Field(() => Number )
  quantity: number;

  @Column({
    type: 'boolean'
  })
  @Field(() => Boolean )
  completed: boolean;

  // FIXME: Relaciones
  
  @ManyToOne( () => List, (l) => l.listItems, { lazy: true } )
  @Field( () => List )
  list: List;

  @ManyToOne( () => Item, (i) => i.listItems, { lazy: true } )
  @Field( () => Item )
  item: Item;

}
