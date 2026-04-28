import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from 'src/artwork/artwork.entity/artwork.entity';
import { ExhibitionEntity } from 'src/exhibition/exhibition.entity/exhibition.entity';
import { ImageEntity } from 'src/image/image.entity/image.entity';
import { MovementEntity } from 'src/movement/movement.entity/movement.entity';
import { MuseumEntity } from 'src/museum/museum.entity/museum.entity';
import { SponsorEntity } from 'src/sponsor/sponsor.entity/sponsor.entity';
import { ArtistEntity } from 'src/artist/artist.entity/artist.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [ArtistEntity, ArtworkEntity, ExhibitionEntity, ImageEntity, MovementEntity, MuseumEntity, SponsorEntity],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([ArtistEntity, ArtworkEntity, ExhibitionEntity, ImageEntity, MovementEntity, MuseumEntity, SponsorEntity]),
];