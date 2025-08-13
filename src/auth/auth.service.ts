import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

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

        if(userExists) {
            throw new ConflictException("Email já está em uso!")
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const newUser = await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                googled: userData.email
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        })
        return newUser;
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({where: {email}})

        if(!user) throw new UnauthorizedException('Credencíais inválidas!')
        if(!user.password) throw new UnauthorizedException('Usuário não possui senha definida (logar com Google)')

        const IsMatch = await bcrypt.compare(password, user.password)

        if(!IsMatch) throw new UnauthorizedException('Credencíais inválidas!')

        return user;
    }

    async login(credentials: LoginDto) {
        const user = await this.validateUser(
            credentials.email,
            credentials.password
        )
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }

        return {
            access_token: this.jwt.sign(payload)
        }
    }

    async findOrCreateGoogleUser({googleId: googled, email, name, password}) {
        let user = await this.prisma.user.findUnique({
            where: {googled}
        });

        if(!user){
            user = await this.prisma.user.create({
                data: {
                    email,
                    name,
                    googled,
                    password
                }
            })
        }

        return user
    }

    singJwtForUser(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }

        return this.jwt.sign(payload)
    }
}

