import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

@ArgsType()
export class QueryFilterArgs {

    @Field( () => Int, { description: 'Current page number', nullable: true, defaultValue: 0 } )
    @IsInt()
    @IsOptional()
    page?: number = 0;

    @Field( () => Int, { description: 'Users for page', nullable: true, defaultValue: 100 } )
    @IsInt()
    @IsOptional()
    rowsForPage?: number = 100;

    @Field( () => String, { description: 'Filter', nullable: true } )
    @IsString()
    @IsOptional()
    filter?: string;
    
    @Field( () => Boolean, { name: 'isActive', description: 'Users for page', nullable: true, defaultValue: true } )
    @IsBoolean()
    @IsOptional()
    isActive: boolean = true;
    
}