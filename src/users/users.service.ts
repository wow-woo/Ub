import { MailService } from './../mailer/mail.service';
import { Verification } from './entities/verification.entity';
import { EditProfileInp } from './dtos/edit-profile.dto';
import { JwtService } from './../jwt/jwt.service';
import { LoginInp } from './dtos/login.dto';
import { CreateAccountInp } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { VerifyEmailOutput } from './dtos/verify-email.dto';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private readonly users:Repository<User>,
        @InjectRepository(Verification) 
        private readonly Verifications:Repository<Verification>,
        private readonly jwtService:JwtService,
        private readonly mailService:MailService,
    ){}

    async createAccount({email,password, role}:CreateAccountInp):Promise<{ok:boolean, error?:string}>{
        try {
            const isExisted = await this.users.findOne({email})
            if(isExisted){
                return {ok:false, error:'The email is already registered'}
            }

            const user = await this.users.save(this.users.create({email, password, role}))
            const verification = await this.Verifications.save(this.Verifications.create({user}))

            this.mailService.sendVerificationEmail(user.email, verification.code)

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
        const user = await this.users.findOne(userId)

        if(inp.email){
            inp.emailVerified = false;
            const verification = await this.Verifications.create({user})
            this.mailService.sendVerificationEmail(user.email, verification.code)
        }
  
        if(inp.password){
            inp.password = await bcrypt.hash(inp.password, 10)
        }
        const result = await this.users.update({id:userId}, {...inp})
        return result
    }

    async verifyEmail(code:string):Promise<VerifyEmailOutput>{
        try {
            const verification = await this.Verifications.findOne(
                {code}, { relations:['user']}
            )

            if(verification){
                verification.user.emailVerified = true
                await this.users.save(verification.user)
                await this.Verifications.delete(verification.id)
    
                return {ok:true}
            }

            return {
                ok:false,
                error:'Verification failed'
            }
        } catch (error) {
            return {
                ok:false,
                error
            }
        }
    }
}