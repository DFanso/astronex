import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(filter: any): Promise<UserDocument | null> {
    return this.userModel
      .findOne(filter)
      .populate({
        path: 'services',
        populate: {
          path: 'category',
          model: 'Category',
        },
      })
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { deleted: true, id };
  }
}
