import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { Institute, InstituteDocument } from './entities/institute.entity';
import * as crypto from 'crypto';

@Injectable()
export class InstitutesService {
  constructor(
    @InjectModel(Institute.name)
    private instituteModel: Model<InstituteDocument>,
  ) {}

  async create(createInstituteDto: CreateInstituteDto): Promise<Institute> {
    const secret = crypto.randomBytes(16).toString('hex');
    const createdInstitute = new this.instituteModel({
      ...createInstituteDto,
      secret,
    });
    return createdInstitute.save();
  }

  async findAll(): Promise<Institute[]> {
    return this.instituteModel.find().exec();
  }

  async findOne(id: string): Promise<Institute> {
    const institute = await this.instituteModel.findById(id).exec();
    if (!institute) {
      throw new NotFoundException(`Institute with ID ${id} not found`);
    }
    return institute;
  }

  async update(
    id: string,
    updateInstituteDto: UpdateInstituteDto,
  ): Promise<Institute> {
    const updatedInstitute = await this.instituteModel
      .findByIdAndUpdate(id, updateInstituteDto, { new: true })
      .exec();
    if (!updatedInstitute) {
      throw new NotFoundException(`Institute with ID ${id} not found`);
    }
    return updatedInstitute;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.instituteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { deleted: true, id };
  }
}
