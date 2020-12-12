import { EditProfileInp } from './dtos/edit-profile.dto';
import { JwtService } from './../jwt/jwt.service';
import { LoginInp } from './dtos/login.dto';
import { CreateAccountInp } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private readonly users:Repository<User>,
        private readonly jwtService:JwtService,
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

    async login({email, password}:LoginInp):Promise<{ok:boolean, error?:string, token?:string }>{
        try {
            const user = await this.users.findOne({email})
            if(!user){
                return {
                    ok:false,
                    error:"User with the email doesn't exist"
                }
            }
        
            const isMatched = await user.checkPassword(password)
            if(!isMatched){
                return {
                    ok:false,
                    error:'Invalid password'
                }
            }
            const token = this.jwtService.sign(user.id) 
            // jwt.sign(, this.config.get('PRIVATE_KEY'))
            return {
                ok:true,
                token
            }
            
        } catch (error) {
            return {
                ok:false,
                error
            }
        }
    }

    async findById(id:number):Promise<User>{
        return this.users.findOne({id});
    }

    async editProfile(userId :number, inp: EditProfileInp){
        console.log('a', inp)
        console.log('b', {...inp})
        if(inp.password){
            inp.password = await bcrypt.hash(inp.password, 10)
        }
        const result = await this.users.update({id:userId}, {...inp})
        return result
    }
}