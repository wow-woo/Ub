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
}