import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { Institute } from './entities/institute.entity';

@ApiTags('institutes')
@Controller({ path: 'institutes', version: '1' })
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Post()
  @ApiOperation({ summary: 'Create institute' })
  @ApiResponse({
    status: 201,
    description: 'The institute has been successfully created.',
    type: Institute,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createInstituteDto: CreateInstituteDto) {
    return this.institutesService.create(createInstituteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all institutes' })
  @ApiResponse({
    status: 200,
    description: 'Return all institutes.',
    type: [Institute],
  })
  findAll() {
    return this.institutesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get institute by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the institute with the given ID.',
    type: Institute,
  })
  @ApiResponse({ status: 404, description: 'Institute not found.' })
  findOne(@Param('id') id: string) {
    return this.institutesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update institute by ID' })
  @ApiResponse({
    status: 200,
    description: 'The institute has been successfully updated.',
    type: Institute,
  })
  @ApiResponse({ status: 404, description: 'Institute not found.' })
  update(
    @Param('id') id: string,
    @Body() updateInstituteDto: UpdateInstituteDto,
  ) {
    return this.institutesService.update(id, updateInstituteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete institute by ID' })
  @ApiResponse({
    status: 200,
    description: 'The institute has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Institute not found.' })
  remove(@Param('id') id: string) {
    return this.institutesService.remove(id);
  }
}
