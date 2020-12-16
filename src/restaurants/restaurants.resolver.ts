import { User } from 'src/users/entities/user.entity';
import { AuthUser } from './../auth/auth-user.decorator';
import { LoginOutput } from './../users/dtos/login.dto';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql'
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantInp } from './dtos/createRestaurant.dto';
import { CreateAccountOutput } from 'src/users/dtos/create-account.dto';
import { SetRole } from 'src/auth/role.decorator';

@Resolver()
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService){}

    @Query(()=>[Restaurant])
    restaurants():Promise<Restaurant[]>{
        return this.restaurantService.getAll()
    }
    
    @SetRole(['Owner'])
    @Mutation(()=>CreateAccountOutput)
    async createRestaurant(
        @AuthUser() authUser:User,
        @Args('inp') dto:CreateRestaurantInp
        ):Promise<CreateAccountOutput>{
            return this.restaurantService.createRestaurant(dto, authUser)
    }
}
