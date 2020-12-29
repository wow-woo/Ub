import { CreateDishInp } from './dtos/create-dish.dto';
import { SearchRestaurantInp, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { RestaurantInp, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInp, RestaurantsOutput } from './dtos/restaurants.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { DeleteRestaurantInp, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { CategoryCustomRepository } from './repositories/category.repository';
import { EditProfileInp, EditProfileOutput } from './../users/dtos/edit-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { Injectable } from "@nestjs/common";
import { ILike, Like, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from "./entities/restaurant.entity";
import { CreateRestaurantInp, CreateRestaurantOutput } from "./dtos/createRestaurant.dto";
import { Category } from './entities/category.entity';
import { EditRestaurantInp } from './dtos/edit-restaurant.dto';
import { RestaurantCustomRepository } from './repositories/restaurant.repository';
import { totalmem } from 'os';

@Injectable()
export class RestaurantService{
    constructor(
    // @InjectRepository(Restaurant) 
    private readonly restaurants:RestaurantCustomRepository,
    // @InjectRepository(CategoryCustomRepository) 
    private readonly categories:CategoryCustomRepository
    ){}

    async getAll():Promise<Restaurant[]>{
        return await this.restaurants.find(
            {relations:['owner','category']}
        )
    }

    

    async createRestaurant(
        inp:CreateRestaurantInp,
        owner:User, 
        ):Promise<CreateRestaurantOutput>{
        
        try {
        const newRestaurant = await this.restaurants.create(inp)
        newRestaurant.owner = owner
        
        const category = await this.categories.getOrCreate(inp.categoryName)

        newRestaurant.category = category
        const result =  await this.restaurants.save(newRestaurant)
            return {
                ok:true,
            }
        } catch (error) {
            return {
                ok:false,
                error
            }
        }
    }

    async editRestaurant(owner:User, inp:EditRestaurantInp):Promise<EditProfileOutput>{
        try {
            const isAuthenticated = await this.restaurants.authenticate(owner, inp)
            if(isAuthenticated){
                return isAuthenticated
            }

            let category:Category|null = null
            if(inp.categoryName){
                category = await this.categories.getOrCreate(inp.categoryName)
            }
            await this.restaurants.save([{
                id:inp.restaurantId,
                ...inp,
                ...(category && {category})
            }])

            return {
                ok:true
            }
        } catch (error) {
            return {
                ok:false,
                error:"Restaurant edit failed"
            }
        }
    }

    async deleteRestaurant(
        owner:User, inp:DeleteRestaurantInp
    ):Promise<DeleteRestaurantOutput>{
        try {
            const isAuthenticated = await this.restaurants.authenticate(owner, inp)
            if(isAuthenticated){
                return isAuthenticated
            }

            await this.restaurants.delete({id:inp.restaurantId})
            return {
                ok:true
            }
        } catch (error) {
            return {
                ok:false,
                error:"Failed on deletion of restaurant"
            }
        }

    }

    async allCategories():Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return {
                ok:true,
                categories
            }
        } catch (error) {
            return {
                ok:false,
                error:"Could not load categories"
            }
        }
    }

    countRestaurants(category:Category){
        return this.restaurants.count({category})
    }

    async findCategoryBySlug({slug, page}:CategoryInput):Promise<CategoryOutput>{
        try {
            const ITEMS_IN_PAGE = 25
            const category = await this.categories.findOne({slug} , { relations:['restaurants']})
            if (!category){
                return {
                    ok:false,
                    error:'The category not found'
                }
            }
            const restaurants = await this.restaurants.find({ where : { category}, take : ITEMS_IN_PAGE, skip : (page-1)* ITEMS_IN_PAGE})
            const totalResult = await this.countRestaurants(category)
            
            return {
                ok:true,
                category,
                restaurants,
                totalPages : Math.ceil(totalResult / ITEMS_IN_PAGE)
            }
        } catch (error) {
            return {
                ok:false,
                error
            }
        }
    } 

    async allRestaurants( { page }:RestaurantsInp):Promise<RestaurantsOutput>{
        try {
            const [results, totalResult ] = await this.restaurants.findAndCount(
                { skip: (page-1) * 25, take : 25})
            return {
                ok:true,
                results,
                totalPages:Math.ceil( totalResult / 25),
                totalResult
            }
        } catch (error) {
            return {
                ok:false,
                error:"Could not load restaurants"
            }
            
        }

    }

    async findRestaurantById({restaurantId}:RestaurantInp):Promise<RestaurantOutput>{
        try {
            const restaurant = await this.restaurants.findOne(restaurantId, { relations : ['menu']})
            if(!restaurant){
                return {
                    ok:false,
                    error:"Restaurant not found"
                }
            }

            return {
                ok:true,
                restaurant
            }
        } catch (error) {
            return {
                ok:false,
                error
            }
            
        }
    }

    async searchRestaurantByName(
        {query, page}:SearchRestaurantInp):Promise<SearchRestaurantOutput>{
            try {
                const [restaurants, totalResult] = await this.restaurants.findAndCount({
                    // where:{name : ILike(`%${query}%`)},
                    where:{name : Raw(name=>`${name} ILIKE '%${query}%' `) },
                    skip:(page - 1 ) * 25,
                    take : 25
                })
                return {
                    ok:true,
                    restaurants,
                    totalPages: Math.ceil( totalResult / 25),
                    totalResult
                }
            } catch (error) {
                return {
                    ok:false,
                    error
                }
            }
    }

    async createDish(
        owner:User,
        inp:CreateDishInp
    ){
        try {
            
            return {
                ok:true,

            }
        } catch (error) {
            return {
                ok:false,
                error
            }
        }
    }

}