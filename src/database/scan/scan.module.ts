import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanEntity } from './scan.entity';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScanEntity])],
  controllers: [ScanController],
  providers: [ScanService],
  exports: [ScanService],
})
export class ScanModule {}
