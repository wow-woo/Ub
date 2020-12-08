import { CreateRestaurantDto } from './dtos/createRestaurant.dto';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql'
import { Restaurant } from 'src/entities/restaurant.entity';

@Resolver()
export class RestaurantResolver {
    @Query(()=>[Restaurant])
    restaurants(@Args('veganOnly') veganOnly: boolean):Restaurant[]{
        return []
    }
    @Mutation(()=>Boolean)
    createRestaurant(
        @Args()
        dto:CreateRestaurantDto
        ):boolean{
        return true;
    }


}
