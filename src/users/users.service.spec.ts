import { MailService } from './../mailer/mail.service';
import { JwtService } from 'src/jwt/jwt.service';
import { Verification } from './entities/verification.entity';
import { User } from './entities/user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';

const mockRepository = ()=>({
    findOne:jest.fn(),
    findOneOrFail:jest.fn(),
    save:   jest.fn(),
    create: jest.fn(),
    update:jest.fn(),
    delete:jest.fn()
})
const mockJwtService = ()=>({
    sign:jest.fn(()=>'signed token'),
    verify:jest.fn(),
})
const mockMailService = ()=>({
    sendVerificationEmail:jest.fn(),
})
type mockRepository<T=any> = Partial< Record<keyof Repository<T>, jest.Mock> >


//create test service
describe('UsersService', ()=>{ 
    let usersRepository :mockRepository<User>;
    let verificationRepository :mockRepository<Verification>;
    let service : UsersService
    let mailService : MailService
    let jwtService : JwtService

    //create test module
    beforeEach(async()=>{
        const module = await Test.createTestingModule({
            //unit test
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User), 
                    useValue:mockRepository()
                },
                {
                    provide: getRepositoryToken(Verification), 
                    useValue:mockRepository()
                },
                {
                    provide: JwtService, 
                    useValue:mockJwtService()
                },
                {
                    provide: MailService, 
                    useValue:mockMailService()
                },
            ]
        }).compile()
        usersRepository = module.get(getRepositoryToken(User))
        verificationRepository = module.get(getRepositoryToken(Verification))
        service = module.get<UsersService>(UsersService)
        mailService = module.get<MailService>(MailService)
        jwtService = module.get<JwtService>(JwtService)
    })

    it.todo('EditProfile > Should change password');
    it.todo('verifyEmail');
    it('should be defined', ()=>{
        expect(service).toBeDefined();
        expect(mailService).toBeDefined();
        expect(verificationRepository).toBeDefined();
        expect(usersRepository).toBeDefined();
    })

    // to-do list
    // it.todo('createAccount');
    describe('CreateAccount', ()=>{
        const createAccountArgs = {
            email:'',
            password:'',
            role:0
        }
        const verificationOutput = {
            code:'code'
        }
        it('Should fail if user exists', async ()=>{
            usersRepository.findOne.mockResolvedValue({
                id:1,
                email:'mock@mock.com',
            })
            const result = await service.createAccount(createAccountArgs)
            expect(result).toMatchObject({
                ok:false,
                error:'The email is already registered'
            })
        })

        it('Should create a new user', async()=>{
            usersRepository.findOne.mockResolvedValue(undefined);
            usersRepository.create.mockReturnValue(createAccountArgs);
            usersRepository.save.mockResolvedValue(createAccountArgs);
            verificationRepository.create.mockReturnValue({user:createAccountArgs})
            verificationRepository.save.mockResolvedValue(verificationOutput)

            const result = await service.createAccount(createAccountArgs)
            
            expect(usersRepository.create).toHaveBeenCalledTimes(1)
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs)
            expect(usersRepository.save).toHaveBeenCalledTimes(1)
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs)

            expect(verificationRepository.create).toHaveBeenCalledTimes(1)
            expect(verificationRepository.create).toHaveBeenCalledWith({user:createAccountArgs})
            expect(verificationRepository.save).toHaveBeenCalledTimes(1)
            expect(verificationRepository.save).toHaveBeenCalledWith({user:createAccountArgs})

            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1)
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                expect.any(String), 
                expect.any(String)
            )
            expect(result).toEqual({
                ok:true
            })

        })

        it('Should fail on exception', async()=>{
            usersRepository.findOne.mockRejectedValue(new Error('glitch'))
            const result = await service.createAccount(createAccountArgs)
            expect(result).toEqual(
                {ok:false, error:'Creating Account failed'}
            )
        })
    })

    describe('Login', ()=>{
        const loginArgs = {
            email:'testEmail',
            password:'testPassword'
        }
        it('Should fail if user does not exist', async()=>{
            usersRepository.findOne.mockResolvedValue(null);
            
            const result = await service.login(loginArgs)
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object))
            expect(result).toEqual(
                {
                    ok:false,
                    error:"User with the email doesn't exist"
                }
            )
        })


        it('Should fail if the password is wrong', async()=>{
            const mockedUser = {
                checkPassword:jest.fn(()=>Promise.resolve(false)),
            }
            usersRepository.findOne.mockResolvedValue(mockedUser)
            const result = await service.login(loginArgs)
            expect(result).toEqual(
                {
                    ok:false,
                    error:'Invalid password'
                }
            )
        })

        it('Should have a token if password is correct', async()=>{
            const mockedUser = {
                id:1,
                checkPassword:jest.fn(()=>Promise.resolve(true)),
            }
            usersRepository.findOne.mockResolvedValue(mockedUser)
            const result = await service.login(loginArgs)
            expect(jwtService.sign).toHaveBeenCalledTimes(1)
            expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number))
            expect(result).toEqual(
                {
                    ok:true,
                    token:'signed token'
                }
            )
        })

        it('Should fail on exception', async()=>{
            usersRepository.findOne.mockRejectedValue(new Error('Glitch~'))
            const result = await service.login(loginArgs)
            expect(result).toEqual(
                {
                    ok:false,
                    error:new Error('Glitch~')
                }
            )
        })
    })

    describe('FindById', ()=>{
        const findByIdArgs = {
            id:1
        }
        it('Should find an existing user', async()=>{
            usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs)
            const result = await service.findById(1)
            expect(result).toEqual(
                {
                    ok:true,
                    user:{id:1}
                }
            )
        })

        it('Should fail if No user found', async()=>{
            usersRepository.findOneOrFail.mockRejectedValue(new Error('Nope~'))
            const result = await service.findById(1);
            expect(result).toEqual(
                {
                    ok:false,
                    error:"User not found"
                }   
            )
        })
    })

    describe('EditProfile', ()=>{
        const editProfileArgs = {
            userId: 1,
            inp: { email: 'bs@new.com', password:'newPassword'},
        };
        const oldUser = {
            email: 'bs@old.com',
            emailVerified: true,
        };
        
        it('Should change email', async () => {
            const newVerification = {
                code: 'code',
            };
            const newUser = {
                emailVerified: false,
                email: editProfileArgs.inp.email,
            };
    
            usersRepository.findOne.mockResolvedValue(oldUser);
            verificationRepository.create.mockReturnValue(newVerification);
            verificationRepository.save.mockResolvedValue(newVerification);
    
            await service.editProfile(editProfileArgs.userId, editProfileArgs.inp);
    
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                editProfileArgs.userId,
            );
    
            expect(verificationRepository.create).toHaveBeenCalledWith({
                user: newUser,
            });
            expect(verificationRepository.save).toHaveBeenCalledWith(newVerification)
            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                newUser.email,
                newVerification.code,
            );
        });

        it('Should change password', async()=>{
            usersRepository.findOne.mockResolvedValue({password:'old'})
            usersRepository.update.mockResolvedValue(undefined)
            
            const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.inp)
            expect(usersRepository.update).toHaveBeenCalledTimes(1)
            expect(usersRepository.update).toHaveBeenCalledWith(
                {
                    id:editProfileArgs.userId,
                    ...editProfileArgs.inp
                }
            )
            expect(result).toEqual(
                {ok:true}
            )
        })

        it('Should fail on exception', async()=>{
            usersRepository.findOne.mockResolvedValue(new Error('Glitch~'))

            const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.inp)
            expect(result).toEqual(
                {
                    ok:false,
                    error:'Profile update has been failed'
                }
            )
        })
    })

    describe('Verify email', ()=>{
        it('Should verify Email', async()=>{
            const mockedVerification = {
                id:1,
                user: {
                    emailVerified:false
                }
            }
            verificationRepository.findOne.mockResolvedValue(mockedVerification)
            const result = await service.verifyEmail('code')

            expect(verificationRepository.findOne).toHaveBeenCalledTimes(1)
            expect(verificationRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object)
            )
            expect(usersRepository.save).toHaveBeenCalledTimes(1)
            expect(usersRepository.save).toHaveBeenCalledWith(
                {
                    emailVerified:true
                }
            )
            expect(verificationRepository.delete).toHaveBeenCalledTimes(1)
            expect(verificationRepository.delete).toHaveBeenCalledWith(
                mockedVerification.id
            )

            expect(result).toEqual(
                {ok:true}
            )

        })

        it('Should fail if No verification', async()=>{
            verificationRepository.findOne.mockResolvedValue(undefined)
            const result = await service.verifyEmail('code')
            expect(result).toEqual(
                {
                    ok:false,
                    error:'No verification code '
                }
            )
        })

        it('Should fail on exception', async()=>{
            verificationRepository.findOne.mockResolvedValue(new Error('Glitch~'))
            const result = await service.verifyEmail('code')
            expect(result).toEqual(
                {
                    ok:false,
                    error:'Verification failed'
                }
            )
        })
    })
})