import { Module } from '@nestjs/common';
import { MuseumService } from './museum.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from './museum.entity/museum.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MuseumEntity]),
  ],
  providers: [MuseumService]
})
export class MuseumModule { }
