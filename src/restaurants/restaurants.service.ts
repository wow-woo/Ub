import { Injectable } from "@nestjs/common";
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRestaurantDto } from './dtos/createRestaurant.dto';
import { UpdateRestaurantDto, UpdateRestaurantType } from './dtos/update-restaurant.dto';
import { Restaurant } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService{
    constructor(@InjectRepository(Restaurant) 
    private readonly restaurants:Repository<Restaurant>
    ){}

    getAll():Promise<Restaurant[]>{
        return this.restaurants.find()
    }

    createRestaurant(dto:CreateRestaurantDto):Promise<Restaurant>{
        const newRestaurant = this.restaurants.create(dto)
        return this.restaurants.save(newRestaurant)
    }

    async updateRestaurant(id:number, dto:UpdateRestaurantType):Promise<UpdateResult>{
        const isExisted = await this.restaurants.findOne(id)

        if (isExisted){
            return this.restaurants.update(id, {...dto})
        }
        else{
            throw Error("data doesn't exist")
        }
    }
}