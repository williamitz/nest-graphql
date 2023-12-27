import { define } from "typeorm-seeding";
import { User } from '../../users/entities/user.entity';
import { rand, randEmail, randFullName } from '@ngneat/falso';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';

define( User, () => {

    const newUser = new User();
    newUser.email = randEmail();
    newUser.fullName = randFullName();
    newUser.password = bcrypt.hashSync( '123456', 10 );
    newUser.roles = [ ...rand( [ ValidRoles.admin, ValidRoles.superUser, ValidRoles.user ], {length: 1} ) ];

    return newUser;

} );
