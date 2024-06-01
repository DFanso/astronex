import { Module } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { InstitutesController } from './institutes.controller';
import { Institute, InstituteSchema } from './entities/institute.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institute.name, schema: InstituteSchema },
    ]),
    AuthModule,
    UsersModule,
    ClsModule,
  ],
  controllers: [InstitutesController],
  providers: [InstitutesService],
  exports: [InstitutesService],
})
export class InstitutesModule {}
