import { User } from 'src/users/entities/user.entity';
import { roles } from './role.decorator';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly reflector:Reflector
    ){}

    //convert http context into graphql context
    canActivate(context:ExecutionContext){ 
        const roles:roles = this.reflector.get(
            'role',
            context.getHandler()
        )
        if(!roles){
            return true
        }

        const gqlCtx = GqlExecutionContext.create(context).getContext();
        const user:User = gqlCtx['user']
        if(!user){
            return false
        }

        if(roles.includes(user.role) || roles.includes('Every')){
            return true
        }else{
            return false
        }
    }
}