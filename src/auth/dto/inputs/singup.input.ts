import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class SingupInput {
    
    @Field( () => String, { description: 'Names and Surnames' } )
    @IsString()
    @IsNotEmpty()
    fullName: string;
    
    @Field( () => String, { description: 'Username' } )
    @IsString()
    @IsEmail()
    email: string;
    
    @Field( () => String, { description: 'Password user' } )
    @IsString()
    passwordUser: string;

    // @Field( () => [String], { description: 'Roles user' } )
    // @IsArray()
    // roles: string[];

}
