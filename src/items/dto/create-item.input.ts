import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsInt } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => String, { description: 'Name To Item' })
  @IsString()
  name: string;
  
  @Field(() => Int, { description: 'Quantity To Item' })
  @IsInt()
  quantity: number;
  
  @Field(() => String, { description: 'Unit measure To Item' })
  @IsString()
  quantityUnits: string;

}
