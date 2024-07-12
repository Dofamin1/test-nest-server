import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { UserData } from "./user.interface";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async create(dto: CreateUserDto): Promise<UserData> {
        const { username, email } = dto;

        const qb = await this.userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .orWhere('user.email = :email', { email });
        const user = await qb.getOne();
        if (user) {
            const errors = { username: 'Username and email must be unique.' };
            throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);
        }

        let newUser = new UserEntity();
        newUser.username = username;
        newUser.email = email;

        const errors = await validate(newUser);
        if (errors.length > 0) {
            const _errors = { username: 'User input is not valid.' };
            throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST);
        } else {
            const userEntity = await this.userRepository.save(newUser);
            return this.buildUserDTO(userEntity);
        }
    }

    async update(dto: UpdateUserDto): Promise<UserEntity> {
        const { userId, ...dataToUpdate } = dto;
        const toUpdate = await this.userRepository.findOne({ where: { id: userId } });

        if (!toUpdate) {
            throw new HttpException({ message: 'User is not found', errors: { id: "id is wrong" } }, HttpStatus.BAD_REQUEST);
        }

        const updated = Object.assign(toUpdate, dataToUpdate);
        return await this.userRepository.save(updated);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete({ id: id });
    }

    async deleteAll(): Promise<DeleteResult> {
        return await this.userRepository.delete({});
    }

    private buildUserDTO(user: UserEntity): UserData {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt.toString(),
            updatedAt: user.updatedAt.toString()
        };
    }
}
