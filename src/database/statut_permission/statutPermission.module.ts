import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutPermissionEntity } from './statutPermission.entity';
import { StatutPermissionService } from './statutPermission.service';
import { StatutPermissionController } from './statutPermission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatutPermissionEntity])],
  controllers: [StatutPermissionController],
  providers: [StatutPermissionService],
  exports: [StatutPermissionService],
})
export class StatutPermissionModule {}
