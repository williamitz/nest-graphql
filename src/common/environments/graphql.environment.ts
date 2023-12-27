import { ApolloDriver } from "@nestjs/apollo";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GqlModuleAsyncOptions } from "@nestjs/graphql";
import { AuthModule } from '../../auth/auth.module';
import { JwtService } from "@nestjs/jwt";

export const graphqlConfig: GqlModuleAsyncOptions = {
    driver: ApolloDriver,
    // debug: false,
    imports: [ AuthModule ],
    inject: [ JwtService ],
    useFactory: ( jwt: JwtService ) => ({
      playground: false,
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ],
      context({ req }) {

        const { authorization = '' } = req.headers as { authorization: string };

        const token = authorization?.replace('Bearer ', '');

        // FIXME: Estas validaciones deberia considerarse cuando 
        // los servicios de autenticación (login, Singup) no deben estar en graphQl 
        // y deben ser servicios tradicionales RESFULAPI

        // if( !token ) throw new Error("Por favor enviar el token");

        // if( !jwt.verify( token ) ) throw new Error("Token not valid");
        

      }
    })
  }

  export default graphqlConfig;