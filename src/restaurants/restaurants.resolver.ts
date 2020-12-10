import { LoginOutput } from './../users/dtos/login.dto';
import { CreateRestaurantDto } from './dtos/createRestaurant.dto';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql'
import { Restaurant } from 'src/entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Resolver()
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService){}

    @Query(()=>[Restaurant])
    restaurants():Promise<Restaurant[]>{
        return this.restaurantService.getAll()
    }
    @Mutation(()=>Boolean)
    async createRestaurant(
        @Args('inp')
        dto:CreateRestaurantDto
        ):Promise<boolean>{
            try {
                await this.restaurantService.createRestaurant(dto)
                return true;
            } catch (err) {
                console.log(err)
                return true;
            }
    }

    @Mutation(()=>Boolean)
    async updateRestaurant(
        @Args('change'){id, data}:UpdateRestaurantDto
    ){
        try {
            await this.restaurantService.updateRestaurant(id, data)
            return true
        } catch (err) {
            console.log(err)
            return false            
        }
    }

}
