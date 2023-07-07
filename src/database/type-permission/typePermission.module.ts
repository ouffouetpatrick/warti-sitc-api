import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypePermissionEntity } from './typePermission.entity';
import { TypePermissionService } from './typePermission.service';
import { TypePermissionController } from './typePermission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypePermissionEntity])],
  controllers: [TypePermissionController],
  providers: [TypePermissionService],
  exports: [TypePermissionService],
})
export class TypePermissionModule {}
