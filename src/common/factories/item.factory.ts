import { define } from "typeorm-seeding";
import { randNumber, randProduct } from '@ngneat/falso';
import { Item } from '../../items/entities/item.entity';

define( Item, () => {

    const newItem = new Item();
    
    const myProduct = randProduct();

    newItem.name = myProduct.title;
    newItem.quantity = randNumber({ min: 5, max: 30 });
    newItem.quantityUnits = 'NIU';

    return newItem;

} );
