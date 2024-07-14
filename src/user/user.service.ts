import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { UserData, XLSXUser } from "./user.interface";
import * as XLSX from 'xlsx';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async uploadUsers(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const users: XLSXUser[] = XLSX.utils.sheet_to_json(worksheet);

        await this.userRepository.manager.transaction(async (tr) => {
            await Promise.all(users.map((user) => {
                tr.insert('user',
                    {
                        email: user.Email,
                        username: user.Name,
                    }
                );
            }))
        })
    }

    async findAll(): Promise<UserData[]> {
        const users = await this.userRepository.find();
        return users.map((u) => this.buildUserDTO(u));
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

        let userEntity = new UserEntity();
        userEntity.email = email;
        userEntity.username = username;
        const newUser = await this.userRepository.save(userEntity);

        return this.buildUserDTO(newUser);
    }

    async update(dto: UpdateUserDto): Promise<UserData> {
        const { userId, ...dataToUpdate } = dto;
        const toUpdate = await this.userRepository.findOne({ where: { id: userId } });

        if (!toUpdate) {
            throw new HttpException({ message: 'User is not found', errors: { id: "id is wrong" } }, HttpStatus.BAD_REQUEST);
        }

        const updated = Object.assign(toUpdate, dataToUpdate);
        const result = await this.userRepository.save(updated);

        return this.buildUserDTO(result);
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
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        };
    }
}
