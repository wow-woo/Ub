import { OrderItem } from './order-item.entity';
import { JoinTable, ManyToMany, OneToMany, RelationId } from 'typeorm';
import { Dish } from './../../restaurants/entities/dish.entity';
import { Restaurant } from './../../restaurants/entities/restaurant.entity';
import { User } from './../../users/entities/user.entity';
import { Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/core.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsEnum, IsNumber } from 'class-validator';

export enum OrderStatus {
    Pending = 'Pending' ,
    Cooking = 'Cooking' ,
    Pickedup = 'Pickedup' ,
    Delivered = 'Delivered'
}

registerEnumType(OrderStatus, {name:'OrderStatus'})

@ObjectType()
@Entity()
export class Order extends CoreEntity{
    @Field(()=>User, {nullable:true})
    @ManyToOne(
        ()=>User, user=>user.orders, 
        {nullable:true, onDelete : 'SET NULL'})
    @JoinColumn()
    customer?:User
    
    @Field(()=>User, {nullable:true})
    @ManyToOne(
        ()=>User, user=>user.rides, 
        {nullable:true, onDelete : 'SET NULL'})
    @JoinColumn()
    driver?:User

    @Field(()=>Restaurant, {nullable:true})
    @ManyToOne(
        ()=>Restaurant, restaurant=>restaurant.orders, 
        {nullable:true, onDelete : 'SET NULL'})
    @JoinColumn()
    restaurant?:Restaurant

    @Field(()=>[OrderItem])
    @ManyToMany(()=>OrderItem)
    @JoinTable()
    items:OrderItem[]

    @Field(()=>Float)
    @IsNumber()
    @Column()
    total:number

    @Field(()=>OrderStatus, { defaultValue:OrderStatus.Pending})
    @IsEnum(OrderStatus)
    @Column({type:'enum', enum:OrderStatus})
    status: OrderStatus

    @RelationId((order:Order)=>order.customer)
    customerId:number

    @RelationId((order:Order)=>order.driver)
    driverId:number

}