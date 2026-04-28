import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from 'src/museum/museum.entity/museum.entity';
import { ArtworkEntity } from 'src/artwork/artwork.entity/artwork.entity';
import { MuseumArtworkService } from './museum-artwork.service';
import { MuseumArtworkController } from './museum-artwork.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity, ArtworkEntity])],
  providers: [MuseumArtworkService],
  controllers: [MuseumArtworkController],
})
export class MuseumArtworkModule { }