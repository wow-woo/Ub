import { CONFIG_OPTIONS } from './../common/common.constants';
import { Test } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken'

const TEST_KEY = {privateKey:'testKey'}
const USER_ID = 1

jest.mock('jsonwebtoken', ()=>{
    return {
        sign:jest.fn(()=>'token'),
        verify:jest.fn(()=>({id:USER_ID}))
    }
})

describe('JwtService', ()=>{
    let service: JwtService

    beforeEach(async()=>{
        const module = await Test.createTestingModule({
            providers:[JwtService, {
                provide:CONFIG_OPTIONS,
                useValue:TEST_KEY
            }],

        }).compile()

        service = module.get<JwtService>(JwtService)
    })

    it('Should be defined', ()=>{
        expect(service).toBeDefined()
    })

    describe('Sign', ()=>{
        it('Should return a signed token', async()=>{
            const result = await service.sign(USER_ID)
            expect(jwt.sign).toHaveBeenCalledTimes(1)
            expect(jwt.sign).toHaveBeenCalledWith({id: USER_ID}, TEST_KEY.privateKey)
            expect(typeof result).toBe('string')
            expect(result).toEqual('token')
        })
    })

    describe('Verify', ()=>{
        it('Should results a verification', async()=>{
            const TOKEN = 'token'
            const result = await service.verify('token')
            expect(jwt.verify).toHaveBeenCalledTimes(1)
            expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY.privateKey)
            expect(result).toEqual({id:USER_ID})
        })    
    })

    it.todo('sign')
    it.todo('verify')
})