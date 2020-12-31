import { GetOrderOutput, GetOrderInp } from './dtos/get-order.dto';
import { Query } from '@nestjs/graphql';
import { GetOrdersOutput, GetOrdersInp } from './dtos/get-orders.dto';
import { SetRole } from './../auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from './../auth/auth-user.decorator';
import { Args } from '@nestjs/graphql';
import { CreateOrderOutput, CreateOrderInp } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { Mutation, Resolver } from '@nestjs/graphql';
import { Order } from './entities/order.entity';

@Resolver(()=>Order)
export class OrderResolver{
    constructor(
        private readonly ordersService : OrderService
    ){}

    @SetRole(['Client'])
    @Mutation(()=>CreateOrderOutput)
    async createOrder(
        @AuthUser() customer:User,
        @Args('inp') inp:CreateOrderInp 
    ):Promise<CreateOrderOutput>{
        return this.ordersService.createOrder(customer, inp)
    }

    @SetRole(['Every'])
    @Query(()=>GetOrdersOutput)
    async getOrders(
        @AuthUser() user:User,
        @Args() inp:GetOrdersInp
    ):Promise<GetOrdersOutput>{
        return this.ordersService.getOrders(user, inp)
    }

    @SetRole(['Every'])
    @Query(()=>GetOrderOutput)
    async getOrder(
        @AuthUser() user:User,
        @Args() inp:GetOrderInp
    ):Promise<GetOrderOutput>{
        return this.ordersService.getOrder(user, inp)
    }
}