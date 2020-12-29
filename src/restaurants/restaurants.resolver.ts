import { CreateDishOutput, CreateDishInp } from './dtos/create-dish.dto';
import { Dish } from './entities/dish.entity';
import { SearchRestaurantInp, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { RestaurantInp, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInp, RestaurantsOutput } from './dtos/restaurants.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { Category } from './entities/category.entity';
import { DeleteRestaurantOutput, DeleteRestaurantInp } from './dtos/delete-restaurant.dto';
import { EditRestaurantInp, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from './../auth/auth-user.decorator';
import { LoginOutput } from './../users/dtos/login.dto';
import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql'
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantInp } from './dtos/createRestaurant.dto';
import { CreateAccountOutput } from 'src/users/dtos/create-account.dto';
import { SetRole } from 'src/auth/role.decorator';

@Resolver()
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService){}

    @Query(()=>RestaurantsOutput)
    async restaurants(
        @Args('inp') inp:RestaurantsInp):Promise<RestaurantsOutput>{
        return this.restaurantService.allRestaurants(inp)
    }

    @Query(()=>Restaurant)
    async restaurant(
        @Args('inp') inp:RestaurantInp):Promise<RestaurantOutput>{
        return this.restaurantService.findRestaurantById(inp)
    }

    @Query(()=>SearchRestaurantOutput)
    searchRestaurant(
        @Args('inp') inp:SearchRestaurantInp
    ):Promise<SearchRestaurantOutput>{
        return this.restaurantService.searchRestaurantByName(inp)
    }

    @SetRole(['Owner'])
    @Mutation(()=>CreateAccountOutput)
    async createRestaurant(
        @AuthUser() authUser:User,
        @Args('inp') dto:CreateRestaurantInp
        ):Promise<CreateAccountOutput>{
            return this.restaurantService.createRestaurant(dto, authUser)
    }

    @SetRole(['Owner'])
    @Mutation(()=>EditRestaurantOutput)
    async editRestaurant(
        @AuthUser() owner:User,
        @Args('inp') inp:EditRestaurantInp
        ):Promise<EditRestaurantOutput>{
            return this.restaurantService.editRestaurant(owner, inp)
    }

    @SetRole(['Owner'])
    @Mutation(()=>DeleteRestaurantOutput)
    async deleteRestaurant(
        @AuthUser() owner:User,
        @Args('inp') inp:DeleteRestaurantInp
        ):Promise<DeleteRestaurantOutput>{
            return this.restaurantService.deleteRestaurant(owner, inp)
    }
}

@Resolver(()=>Category)
export class CategoryResolver {
    constructor(private readonly restaurantService : RestaurantService){}

    @Query(()=>AllCategoriesOutput)
    async allCategories():Promise<AllCategoriesOutput>{
        return this.restaurantService.allCategories();
    }

    @Query(()=>CategoryOutput)
    async category(
        @Args('inp') inp : CategoryInput):Promise<CategoryOutput>{
        return this.restaurantService.findCategoryBySlug(inp)
    }

    @ResolveField(()=>Number)
    async restaurantCount(@Parent() parent:Category):Promise<number> {
        return this.restaurantService.countRestaurants(parent)
    } 
}

@Resolver(()=>Dish)
export class DishResolver {
    constructor(private readonly restaurantService: RestaurantService ){}

    @Mutation(()=>CreateDishOutput)
    @SetRole(['Owner'])
    createDish(
        @AuthUser() owner:User,
        @Args('inp') inp:CreateDishInp
    ):Promise<CreateDishOutput>{
        return this.restaurantService.createDish(owner, inp)
    }
}