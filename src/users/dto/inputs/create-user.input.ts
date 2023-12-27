import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  
  @Field( () => String, { description: 'Names and Surnames' } )
  @IsString()
  @IsNotEmpty()
  fullName: string;
  
  @Field( () => String, { description: 'Username' } )
  @IsString()
  @IsEmail()
  email: string;

}
