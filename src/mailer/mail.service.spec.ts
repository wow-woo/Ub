import { CONFIG_OPTIONS } from './../common/common.constants';
import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';
import got from 'got'
import * as FormData from 'form-data'


jest.mock('got')
jest.mock('form-data')

const MailModuleOptions = {
    apiKey:'TEST_API_KEY',
    domain:'TEST_DOMAIN',
    fromEmail:'TEST_FROM_EMAIL'
}

describe('MailService', ()=>{
    let service : MailService

    beforeEach(async()=>{
        const module = await Test.createTestingModule({
            providers: [MailService, {
                provide:CONFIG_OPTIONS,
                useValue:MailModuleOptions
            }],

        }).compile()

        service = module.get<MailService>(MailService)
    })

    it('Should be defined', ()=>{
        expect(service).toBeDefined()    
    })
    
    describe('SendVerificationEmail', ()=>{
        it('Should call sendEmail function', async()=>{
            const sendVerificationEmailArgs={
                email:'Verify Your Email', 
                code:'verification_mail',
                code3:[ 
                    {key:'code', value:'verification_mail'},
                    {key:'username', value:'Verify Your Email'}
                ]
            }
            jest.spyOn(service, 'sendEmail').mockImplementation(async()=>({ok:true}))

            service.sendVerificationEmail(
                sendVerificationEmailArgs.email,
                sendVerificationEmailArgs.code
            )

            expect(service.sendEmail).toHaveBeenCalledTimes(1)
            expect(service.sendEmail).toHaveBeenCalledWith(
                sendVerificationEmailArgs.email,
                sendVerificationEmailArgs.code,
                sendVerificationEmailArgs.code3,
            )
        })
    })

    describe('SendEmail', ()=>{
        it('Send an email', async()=>{
            const result = await service.sendEmail('', '', [ { key:'key', value:'value' }])

            const formSpy = jest.spyOn(FormData.prototype, 'append')
            expect(formSpy).toHaveBeenCalled()
            expect(got.post).toHaveBeenCalledTimes(1)
            expect(got.post).toHaveBeenLastCalledWith(
                `https://api.mailgun.net/v3/${MailModuleOptions.domain}/messages/`, 
                expect.any(Object))
            expect(result).toEqual(
                {
                    ok:true
                }
            )
        })

        it('Fail on exception', async()=>{
            jest.spyOn(got, 'post').mockImplementation(()=>{
                throw new Error('Glitch')
            })
            const result = await service.sendEmail('', '', [ { key:'key', value:'value' }])
            
            expect(result).toEqual(
                {
                    ok:false,
                    error:'Failed on sending an verification mail'
                }
            )
        })
    })



})