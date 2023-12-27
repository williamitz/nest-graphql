import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { List } from '../../lists/entities/list.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  
  @Column({
    type: 'varchar',
    length: 45
  })
  @Field(() => String)
  fullName: string;
  
  @Column({
    type: 'varchar',
    length: 65,
    unique: true
  })
  @Field(() => String)
  email: string;
  
  @Column({
    type: 'varchar',
    length: 200,
  })
  password: string;
  
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne( () => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true } )
  @JoinColumn()
  @Field( () => User, { nullable: true } )
  lastUpdateBy?: User;

  @OneToMany( () => Item, (i) => i.user, { lazy: true } )
  items: Item[];
  
  @OneToMany( () => List, (l) => l.user )
  lists: List[];
  
}
