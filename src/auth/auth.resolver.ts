import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

import { SingupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtUser } from './decorators/jwt-user.decorator';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver()
export class AuthResolver {

  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse , { name: 'singup' } )
  singup( @Args('singUpInput') singUpInput: SingupInput ): Promise<AuthResponse> {
    return this.authService.onSingUp( singUpInput );
  }

  @Mutation( () => AuthResponse , { name: 'login' } )
  login( @Args('loginInput') loginInput: LoginInput ): Promise<AuthResponse> {
    return this.authService.onLogin( loginInput );
  }

  @Query( () => AuthResponse, { name: 'revalidate' } )
  @UseGuards( JwtAuthGuard )
  revalidateToken( 
    @JwtUser( [ ValidRoles.user ] ) user: User 
  ): AuthResponse {

    return this.authService.onRevalidateToken( user );
    
  }

}
