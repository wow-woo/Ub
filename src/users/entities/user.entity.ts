import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

enum UserRoles {
    Client,
    Owner,
    Delivery
}
registerEnumType(UserRoles, {name:'UserRoles'})

@ObjectType()
@Entity()
export class User extends CoreEntity{

    @Field(()=>String)
    @Column()
    email:string
    
    @Field(()=>String)
    @Column()
    password:string
    
    @Field(()=>UserRoles)
    @Column( { type:'enum', enum: UserRoles})
    role:UserRoles

    @BeforeInsert()
    async hashPassword(){
        try {
            this.password  = await bcrypt.hash(this.password, 10)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}