import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from 'src/museum/museum.entity/museum.entity';
import { MuseumService } from 'src/museum/museum.service';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity])],
  providers: [MuseumService],
})
export class MuseumModule { }