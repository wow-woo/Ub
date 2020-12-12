import { BeforeInsert } from 'typeorm';
import { Column } from 'typeorm';
import { User } from './user.entity';
import { Field } from '@nestjs/graphql';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { v4 as uuidV4 } from 'uuid';

@Entity()
@InputType()
@ObjectType()
export class Verification extends CoreEntity{
    @Column()
    @Field(()=>String)
    code : string

    @OneToOne(()=>User, { onDelete : 'CASCADE'})
    @JoinColumn()
    user:User

    @BeforeInsert()
    createCode():void{
        this.code= uuidV4()
    }
}