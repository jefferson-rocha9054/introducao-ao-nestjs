import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { access } from 'fs';


@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private prisma: PrismaService
    ){}

    async registerUser(userData: RegisterDto) {
        const userExists = await this.prisma.user.findUnique({
            where: {email: userData.email}
         })
    
         if(userExists){
            throw new ConflictException("Email ja esta em uso")
         }
         const hashedpassword = await bcrypt.hash(
            userData.password, 10)
        const newUser =  await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedpassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        })
        return newUser;

    
    
        }
        async validateUser(email: string, password: string) {

            const user = await this.prisma.user.findUnique({where:{email}})
            if(!user) throw new UnauthorizedException('credenciais invalidas!')

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) throw new UnauthorizedException('credenciais invalidas!')
    
            return user;    
    
            }
    async login(credentials: LoginDto) {
        const user = await this.validateUser(
            credentials.email,
            credentials.password
        )
    
        const payload = {
            userid: user.id,
            email: user.email,
            role: user.role
        }
    
        return {
            access_token: this.jwt.sign(payload)
        }
    
    
    } 


}

