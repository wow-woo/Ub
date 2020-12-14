import { SendEmailOutput } from './dtos/sendEmail.dto';
import { MailModuleOptions, EmailVar } from './mail.interfaces';
import { CONFIG_OPTIONS } from './../common/common.constants';
import { Inject, Injectable } from '@nestjs/common';
import got from 'got'
import * as FormData from 'form-data'

@Injectable()
export class MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) 
        private readonly options:MailModuleOptions
    ){}
    
    async sendEmail(
        subject:string, 
        template:string, 
        e:EmailVar[],
        // to:string
        ):Promise<SendEmailOutput>{
        const form = new FormData()
        form.append("from", `mailingCowboy from Ub <mailgun@${this.options.domain}>`)
        form.append("to", "inforphones@gamil.com")
        form.append("subject", subject)
        form.append("template", template)
        form.append("v:username", "miyu")
        form.append("v:code", "thisiscodemannnnn")
        e.forEach(item=> form.append(`v:${item.key}`, item.value))
        try {
            const res = await got.post(`https://api.mailgun.net/v3/${this.options.domain}/messages/`, 
            {
                method:'POST',
                headers:{
                    Authorization:`Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },
                body:form
            })
            
            return {
                ok:true
            }
        } catch (error) {
            return {
                ok:false,
                error:'Failed on sending an verification mail'
            }
        }
    }

    sendVerificationEmail(email:string, code:string){
        this.sendEmail('Verify Your Email', 'verification_mail', 
        [ 
            {key:'code', value:code},
            {key:'username', value:email}
        ])

    }
}
