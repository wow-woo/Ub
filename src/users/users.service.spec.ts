import { MailService } from './../mailer/mail.service';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verification.entity';
import { User } from './entities/user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';

const mockRepository = {
    findOne:jest.fn(),
    save:   jest.fn(),
    create: jest.fn(),
}
const mockJwtService = {
    sign:jest.fn(),
    verify:jest.fn(),
}
const mockMailService = {
    sendVerificationEmail:jest.fn(),
}
type mockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

//create test service
describe('UsersService', ()=>{
    let service : UsersService
    let usersRepository :mockRepository<User>;

    //create test module
    beforeAll(async()=>{
        const module = await Test.createTestingModule({
            //unit test
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User), 
                    useValue:mockRepository
                },
                {
                    provide: getRepositoryToken(Verification), 
                    useValue:mockRepository
                },
                {
                    provide: JwtService, 
                    useValue:mockJwtService
                },
                {
                    provide: MailService, 
                    useValue:mockMailService
                },
            ]
        }).compile()
        service = module.get<UsersService>(UsersService)
        usersRepository = module.get(getRepositoryToken(User))
    })

    it('should be defined', ()=>{
        expect(service).toBeDefined();
    })

    // to-do list
    // it.todo('createAccount');
    describe('createAccount', ()=>{
        it('should fail if user exists', ()=>{

        }
    })
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
})