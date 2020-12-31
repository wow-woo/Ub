import { GetOrderInp, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersOutput, GetOrdersInp } from './dtos/get-orders.dto';
import { Dish } from './../restaurants/entities/dish.entity';
import { OrderItem } from './entities/order-item.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User, UserRoles } from 'src/users/entities/user.entity';
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
        private readonly restaurantRepository: Repository<Restaurant>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,

        @InjectRepository(Dish)
        private readonly dishRepository: Repository<Dish>
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
            let orderFinalPrice = 0
            const orderItems:OrderItem[] =[]
            for (const item of items){
                const dish = await this.dishRepository.findOne(item.dishId)
                if(!dish){
                    return {
                        ok:false,
                        error:"That dish doesn't exist"
                    }
                }
                let dishFinalPrice = dish.price

                for (const itemOption of item.options){
                    const dishOption = await dish.options.find(
                        dishOption=>dishOption.name === itemOption.name)
                    if(dishOption){
                        if(dishOption.extraCost){
                            dishFinalPrice += dishOption.extraCost
                        }
                        else{
                            const dishOptionChoice = dishOption.choices.find(
                                optionChoice=>optionChoice.name === itemOption.choice)
                            if(dishOptionChoice){
                                if(dishOptionChoice.extraCost){
                                    dishFinalPrice += dishOptionChoice.extraCost
                                }
                            }
                        }
                    }
                }

                orderFinalPrice += dishFinalPrice

                const orderItem = await this.orderItemRepository.save(
                    this.orderItemRepository.create({dish, options:item.options}))
                orderItems.push(orderItem)
            }

            await this.ordersRepository.save(
                this.ordersRepository.create({
                    customer,
                    restaurant,
                    items:orderItems,
                    total:orderFinalPrice
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

    async getOrders(
        user:User,
        {status} :GetOrdersInp
    ):Promise<GetOrdersOutput>{
      try {
        if(!status){
            return {
                ok:false,
                error:'No status of order found'
            }
        }
        let orders:Order[] = null;
        if(user.role === UserRoles.Client){
            orders = await this.ordersRepository.find(
                {where:{customer:user, status}})
        }
        else if(user.role === UserRoles.Delivery){
            orders = await this.ordersRepository.find(
                {where:{driver:user, status}})
        }
        else if(user.role === UserRoles.Owner){
            const restaurants = await this.restaurantRepository.find(
                {where:{owner:user, status}, relations:['orders']})
            
            if(!restaurants){
                return {
                    ok:true,
                }
            }
            const allOrders = restaurants.map(restaurant=>restaurant.orders).flat(1)
            orders = allOrders.filter(order=>order.status===status)
        }
        else{
            return {
                ok:false,
                error:"User doesn't have a valid role"
            }
        }
        return {
            ok:true,
            orders
        }
      } catch (error) {
        return {
            ok:false,
            error
        }
      }
    }

    async getOrder(
        user:User,
        {id: orderId }:GetOrderInp
    ):Promise<GetOrderOutput>{
        try {
            const order= await this.ordersRepository.findOne(
                orderId, { relations:['restaurant']})
            if(!order){
                return {
                    ok:false,
                    error:"The order not found"
                }
            }
            let canSee = true;
            if(user.role === UserRoles.Client && order.customerId !== user.id){
                canSee = false;
            }
            else if(user.role === UserRoles.Delivery && order.driverId !== user.id){
                canSee = false;
            }
            else if(user.role === UserRoles.Owner && order.restaurant.ownerId !== user.id){
                canSee = false
            }
            if(!canSee){
                return {
                    ok:false,
                    error:"No Authority for the order"
                }
            }
            
            return {
                ok:true,
                order
            }
        } catch (error) {
            return {
                ok:false,
                error
            }
        }
    }
}