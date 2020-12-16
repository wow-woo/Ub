import { DeleteRestaurantInp, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { CategoryCustomRepository } from './repositories/category.repository';
import { EditProfileInp, EditProfileOutput } from './../users/dtos/edit-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from "./entities/restaurant.entity";
import { CreateRestaurantInp, CreateRestaurantOutput } from "./dtos/createRestaurant.dto";
import { Category } from './entities/category.entity';
import { EditRestaurantInp } from './dtos/edit-restaurant.dto';
import { RestaurantCustomRepository } from './repositories/restaurant.repository';

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

}