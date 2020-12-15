import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity} from "typeorm";
import { IsString } from 'class-validator';

@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    @Field(()=> String)
    @Column()
    name : string
    
    @Field(()=>String)
    @Column()
    @IsString()
    coverImage: string
    
    @Field(()=>String, { defaultValue:'강남'})
    @Column()
    @IsString()
    address: string
    
}