import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from 'bcrypt';
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