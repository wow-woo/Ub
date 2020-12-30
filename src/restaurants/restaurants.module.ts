import { Dish } from './entities/dish.entity';
import { CategoryCustomRepository } from './repositories/category.repository';
import { RestaurantService } from './restaurants.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantResolver, CategoryResolver, DishResolver } from './restaurants.resolver';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantCustomRepository } from './repositories/restaurant.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Restaurant, CategoryCustomRepository, Dish, RestaurantCustomRepository])],
  providers: [RestaurantResolver, CategoryResolver, DishResolver,  RestaurantService, ],
})
export class RestaurantsModule {}
