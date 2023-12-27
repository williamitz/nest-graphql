import { ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule } from "@nestjs/config";

import graphqlConfig from "./environments/graphql.environment";
import { envValidation } from "./environments/env-schema.environment";
import envConfig from "./environments/env-config.environment";
import { typeOrmConfig } from "./environments/db-config.environment";

@Module({
    imports: [
        
        GraphQLModule.forRootAsync( graphqlConfig ),

        ConfigModule.forRoot({
          validationSchema: envValidation,
          load: [ envConfig ]
          
        }),

        TypeOrmModule.forRootAsync( typeOrmConfig )

    ],
    exports: [
        GraphQLModule,
        ConfigModule,
        TypeOrmModule
    ],
})
export class CommonModule { }
