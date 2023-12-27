import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuard extends AuthGuard('jwt') {

    getRequest( context: ExecutionContext    ) {

        const ctx = GqlExecutionContext.create( context );
        //OJO: Retornamos la request
        return ctx.getContext().req;

    }
    
}