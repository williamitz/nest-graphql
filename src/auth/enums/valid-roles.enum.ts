import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
    admin       = 'admin',
    user        = 'user',
    superUser   = 'superUser',
}

registerEnumType( ValidRoles, { name: 'ValidRoles', description: 'Cillum Lorem dolore nostrud et non occaecat nulla fugiat sunt enim Lorem est incididunt veniam.' } );
