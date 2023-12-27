import { ExecutionContext, InternalServerErrorException, createParamDecorator, ForbiddenException } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from "../enums/valid-roles.enum";
import { User } from '../../users/entities/user.entity';

export const JwtUser = createParamDecorator( 
    ( roles: ValidRoles[] = [], context: ExecutionContext ) => {

        const ctx = GqlExecutionContext.create( context );

        const user = ctx.getContext().req.user as User;

        if( !user ) throw new InternalServerErrorException('No user inside to request');

        if( roles.length == 0 ) return user;

        if( !user.roles.some( (e) => roles.includes( e as ValidRoles ) ) ) 
            throw new ForbiddenException(`User #${ user.fullName } need role ${ roles.join(', ') }`);
        
        return user;
        
    
} );
