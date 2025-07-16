import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { find } from 'rxjs';

@Controller('users')
export class UsersController {
constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() data: any) {
    return this.usersService.create(data);
    }

    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    find (@Param('id')id: string) {
        return this.usersService.findone(id)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data:any) {
        return this.usersService.update(id, data)
    }

    @Delete('id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }

    
}
