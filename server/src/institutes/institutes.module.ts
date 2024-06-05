import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';
import { InstitutesService } from './institutes.service';
import { InstitutesController } from './institutes.controller';
import { Institute, InstituteSchema } from './entities/institute.entity';
import { JoinRequest, JoinRequestSchema } from './entities/join-request-entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institute.name, schema: InstituteSchema },
      { name: JoinRequest.name, schema: JoinRequestSchema },
    ]),
    AuthModule,
    UsersModule,
    ClsModule,
    EmailModule,
  ],
  controllers: [InstitutesController],
  providers: [InstitutesService],
  exports: [InstitutesService],
})
export class InstitutesModule {}
