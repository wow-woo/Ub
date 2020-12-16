import { User } from 'src/users/entities/user.entity';
import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from "./entities/restaurant.entity";
import { CreateRestaurantInp, CreateRestaurantOutput } from "./dtos/createRestaurant.dto";
import { Category } from './entities/category.entity';

@Injectable()
export class RestaurantService{
    constructor(
    @InjectRepository(Restaurant) 
    private readonly restaurants:Repository<Restaurant>,
    @InjectRepository(Category) 
    private readonly categories:Repository<Category>
    ){}

    getAll():Promise<Restaurant[]>{
        return this.restaurants.find()
    }

    async createRestaurant(
        inp:CreateRestaurantInp,
        owner:User, 
        ):Promise<CreateRestaurantOutput>{
        
        try {
        const newRestaurant = await this.restaurants.create(inp)
        newRestaurant.owner = owner
        const categoryName = inp.categoryName.trim().toLowerCase()
        const slug = inp.categoryName.replace(/ /g, '-')
        
        let category = await this.categories.findOne({slug})
        if(!category){
            category = await this.categories.save(this.categories.create({
                slug,
                name:categoryName
            }))
        }
        newRestaurant.category = category
        console.log(newRestaurant)
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

}