import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature( [Order, Restaurant] )],
    providers:[
        OrderService,
        OrderResolver
    ]
})
export class OrdersModule {
}