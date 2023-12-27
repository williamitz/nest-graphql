import { Factory, Seeder } from "typeorm-seeding";
import { User } from '../../users/entities/user.entity';
import { Item } from '../../items/entities/item.entity';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';

export class UserSeed implements Seeder {

    async run( factory: Factory ): Promise<void> {
        
        await factory( User )()
        .map( async (u) => {

            u.items = await factory( Item )()
                            // .map( async( i ) => {
                            //     i.user = u;
                            //     return i;
                            // } )
                            .createMany(10);

            return u;
        })
        .createMany(10);


        await factory( User )()
        .map( async( u ) => {
            
            u.fullName = 'William Calle';
            u.email = 'calle.usp@gmail.com';
            u.roles = [ ValidRoles.user, ValidRoles.superUser ];

            u.items = await factory( Item )()
                            .createMany(20);

            return u;
        } )
        .create();

    }
    
}
