import { Order } from './../../orders/entities/order.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { IsBoolean } from 'class-validator';
import { IsString } from 'class-validator';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from "src/common/entities/core.entity";
import { AfterUpdate, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

export enum UserRoles {
    Client='Client',
    Owner='Owner',
    Delivery='Delivery'
}
registerEnumType(UserRoles, {name:'UserRoles'})

@ObjectType()
@Entity()
export class User extends CoreEntity{

    @Field(()=>String)
    @Column({unique:true})
    email:string
    
    @Field(()=>String)
    @Column()
    @IsString()
    password:string
    
    @Field(()=>UserRoles)
    @Column( { type:'enum', enum: UserRoles})
    role:UserRoles

    @Field(()=>[Restaurant])
    @OneToMany(()=>Restaurant, restaurant=>restaurant.owner)
    restaurants?:Restaurant[]
    
    @Field(()=>Boolean, {nullable:true, defaultValue:false})
    @Column({default:false})
    @IsBoolean()
    emailVerified:boolean

    @Field(()=>[Order], {nullable:true})
    @OneToMany(()=>Order, order=>order.customer)
    orders:Order[]

    @Field(()=>[Order], {nullable:true})
    @OneToMany(()=>Order, order=>order.driver)
    rides:Order[]

    @BeforeInsert()
    async hashPassword(){
        try {
            const hashed = await bcrypt.hash(this.password, 10)
            this.password = hashed 
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }

    //entity could have methods called by itself
    async checkPassword(aPassword:string) : Promise<boolean> {
        try {
            const ok =await bcrypt.compare(aPassword, this.password)
            return ok;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}