import { Post, Body, Put, Get, Delete, Param, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('user')
@Controller()
export class UserController {

    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Get all users' })
    @Get('user')
    async getAll() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: 'Create a new user' })
    @Post('user')
    async create(@Body() userData: CreateUserDto) {
        return this.userService.create(userData);
    }

    @Put('user')
    @ApiOperation({ summary: 'Update user' })
    async update(@Body() userData: UpdateUserDto) {
        return await this.userService.update(userData);
    }

    @Delete('user/:id')
    @ApiOperation({ summary: 'Delete user' })
    async delete(@Param() params) {
        return await this.userService.delete(params.id);
    }

    @Delete('user')
    @ApiOperation({ summary: 'Delete all users' })
    async deleteAll(@Param() params) {
        return await this.userService.deleteAll();
    }
}
