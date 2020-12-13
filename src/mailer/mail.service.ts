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
    
    private async sendEmail(
        subject:string, 
        template:string, 
        e:EmailVar[],
        // to:string
        ){
        const form = new FormData()
        form.append("from", `mailingCowboy from Ub <mailgun@${this.options.domain}>`)
        form.append("to", "inforphones@gamil.com")
        form.append("subject", subject)
        form.append("template", template)
        form.append("v:username", "miyu")
        form.append("v:code", "thisiscodemannnnn")
        e.forEach(item=> form.append(`v:${item.key}`, item.value))
        try {
            const res = await got(`https://api.mailgun.net/v3/${this.options.domain}/messages/`, 
            {
                method:'POST',
                headers:{
                    Authorization:`Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },
                body:form
            })    
        } catch (error) {
            console.log('error', error)
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
