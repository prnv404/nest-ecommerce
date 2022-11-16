import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from 'src/auth/auth.dto';
import { User } from 'src/types/user.js';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    private sanitizerUser(user: User) {
        return user.depopulate('password');
    }

    async create(userDto: RegisterDto) {
        const { username } = userDto;

        const user = await this.userModel.findOne({ username });

        if (user) {
            throw new HttpException(
                'User is already exist',
                HttpStatus.BAD_REQUEST,
            );
        }

        const createdUser = new this.userModel(userDto);

        await createdUser.save();

        return this.sanitizerUser(createdUser);
    }

    async findByLogin(userDto: LoginDto) {
        const { password, username } = userDto;

        const user = await this.userModel.findOne({ username });

        if (!user) {
            throw new HttpException(
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (!bcrypt.compare(password, user.password)) {
            throw new HttpException(
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return this.sanitizerUser(user);
    }
}
