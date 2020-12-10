import { CreateAccountInp } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private readonly users:Repository<User>
    ){}

    async createAccount({email,password, role}:CreateAccountInp):Promise<{ok:boolean, error?:string}>{
        try {
            const isExisted = await this.users.findOne({email})
            if(isExisted){
                return {ok:false, error:'The email is already registered'}
            }

            await this.users.save(this.users.create({email, password, role}))
            return {ok:true}
        } catch (err) {
            console.log(err)
            return {ok:false, error:'Creating Account failed'}
        }
    }
}