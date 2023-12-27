import { Field, ObjectType } from "@nestjs/graphql";
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
    
    @Field( () => User )
    data: User;

    @Field( () => String )
    token: string;

}