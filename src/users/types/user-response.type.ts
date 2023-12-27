import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@ObjectType()
export class UserListResponse {
    
    @Field( () => [User] )
    users: User[] = [];
    
    @Field( () => Int )
    total: number;

}
