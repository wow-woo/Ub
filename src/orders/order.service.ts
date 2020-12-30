import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInp, CreateOrderOutput } from './dtos/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService{
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,

        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>
    ){}

    async createOrder(customer:User, {restaurantId, items}:CreateOrderInp):Promise<CreateOrderOutput>{
        try {
            const restaurant = await this.restaurantRepository.findOne(restaurantId)
            if(!restaurant){
                return {
                    ok:false,
                    error:"The restaurant doesn't exist"
                }
            }
            await this.ordersRepository.save(
                this.ordersRepository.create({
                    customer,
                    restaurant 
                })
            )

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