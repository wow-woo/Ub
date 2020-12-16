import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Restaurant)
export class RestaurantCustomRepository extends Repository<Restaurant>{
    async authenticate(owner:User, inp){
        const restaurant = await this.findOne(
            inp.restaurantId,
            {loadRelationIds:true}
        )
        if(!restaurant){
            return {
                ok:false,
                error:`The restaurant not found`
            }
        }

        if(owner.id !== restaurant.ownerId ){
            return {
                ok:false,
                error:'Only owner of the restaurant could edit'
            }
        }
    }
}