import { Field } from '@nestjs/graphql';
import { Dish,  DishChoice } from './../../restaurants/entities/dish.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
export class OrderItemOption{
    @Field(()=>String)
    name : string

    @Field(()=>DishChoice, {nullable:true})
    choice?: DishChoice

    @Field(()=>Number, {nullable:true})
    extra?:number
}

@ObjectType()
@Entity()
export class OrderItem extends CoreEntity{
    @ManyToOne(
        ()=>Dish, {nullable:true , onDelete:'CASCADE'})
    @JoinColumn()
    dish:Dish

    @Field(()=>[OrderItemOption], {nullable:true})
    @Column({type:'json', nullable:true})
    options?:OrderItemOption[]
}