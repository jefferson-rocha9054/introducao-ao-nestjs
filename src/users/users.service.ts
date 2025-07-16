import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { promises } from 'dns';

@Injectable()
export class UsersService {
constructor(private prisma: PrismaService) {}

    async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async findone(id: string): Promise<User | null> {
        const foundUser = await this.prisma.user.findUnique(
            {where:{id}}
        ) 
        if(!foundUser) {
            throw new NotFoundException(`usuario com id ${id} não encontrado!`)
        }
        return foundUser
    }
    async update(id: string, data:Prisma.UserUpdateInput): Promise<User | null> {
        const foundid = await this.prisma.user.findUnique({where: {id}})

        if(!foundid){
            throw new NotFoundException(`usuario com id ${id} não encontrado!`)
        }
    
        return await this.prisma.user.update({where: {id}, data})
    
    }

    async remove (id: string): Promise<User | null> {
        try{
            return await this.prisma.user.delete({where: {id}})
        }catch {
            throw new NotFoundException(`usuario com id ${id} não encontardo`)
        }
    }

}