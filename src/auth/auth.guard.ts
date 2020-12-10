import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context:ExecutionContext){
        
        //convert http context into graphql context
        const gqlCtx = GqlExecutionContext.create(context).getContext();
        const user = gqlCtx['user']
        if(!user){
            return false
        }
        
        return true
    }
}