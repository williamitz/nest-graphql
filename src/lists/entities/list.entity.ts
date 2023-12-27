import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'listId' })
  id: string;
  
  @Column({
    type: 'varchar',
    length: 45,
    nullable: false
  })
  @Field(() => String, { description: 'Name List' })
  name: string;

  @ManyToOne( () => User, (u) => u.lists, { nullable: false } )
  @Index('userId-list-index')
  user: User;

  @OneToMany( () => ListItem, (li) => li.list, { lazy: true } )
  // @Field( () => [ListItem] )
  listItems: ListItem[];

}
