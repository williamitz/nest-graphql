import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@ObjectType()
@Entity()
export class Item {
  
  @Field(() => String, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Field(() => String, { description: 'Name Item' })
  @Column({
    type: 'varchar',
    length: 45,
    nullable: false
  })
  name: string;
  
  @Field(() => Int, { description: 'Quantity stock' })
  @Column({
    type: 'int',
    nullable: false
  })
  quantity: number;
  
  @Field(() => String, { description: 'Unit Measure' })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false
  })
  quantityUnits: string;

  @ManyToOne( () => User, (u) => u.items, { lazy: true } )
  @Index('userId-index')
  @Field( () => User )
  user: User;

  @OneToMany( () => ListItem, (li) => li.item, { lazy: true } )
  @Field( () => [ListItem] )
  listItems: ListItem[];

}
