import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExhibitionEntity } from "src/exhibition/exhibition.entity/exhibition.entity";
import { MuseumEntity } from "src/museum/museum.entity/museum.entity";
import { ImageEntity } from "src/image/image.entity/image.entity";
import { ArtistEntity } from "src/artist/artist.entity/artist.entity";

@Entity()
export class ArtworkEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    year: number;

    @Column()
    description: string;

    @Column()
    type: string;

    @Column()
    image: string;

    @ManyToOne(() => MuseumEntity, (museum) => museum.artworks)
    museum: MuseumEntity;

    @ManyToOne(() => ExhibitionEntity, exhibition => exhibition.artworks)
    exhibition: ExhibitionEntity;

    @OneToMany(() => ImageEntity, image => image.artwork)
    images: ImageEntity[];

    @ManyToOne(() => ArtistEntity, artist => artist.artworks)
    artist: ArtistEntity;
}
