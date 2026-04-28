import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from "src/shared/errors/business-errors";
import { InjectRepository } from "@nestjs/typeorm";
import { MuseumEntity } from "src/museum/museum.entity/museum.entity";
import { LessThan, Like, Repository } from "typeorm";

@Injectable()
export class MuseumService {
    constructor(
        @InjectRepository(MuseumEntity)
        private readonly museumRepository: Repository<MuseumEntity>,
    ) { }

    async findAll(city?: string, name?: string, foundedBefore?: number, page: number = 1, limit: number = 10): Promise<{ data: MuseumEntity[], total: number, page: number, totalPages: number }> {
        const where: any = {};
        if (city) where.city = city;
        if (name) where.name = Like(`%${name}%`);
        if (foundedBefore) where.foundedBefore = LessThan(foundedBefore);

        const [data, total] = await this.museumRepository.findAndCount({
            where,
            relations: ['artworks', 'exhibitions'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<MuseumEntity> {
        const museum = await this.museumRepository.findOne({ where: { id }, relations: ['artworks', 'exhibitions'] });
        if (!museum) {
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        }
        return museum;
    }

    async create(museum: MuseumEntity): Promise<MuseumEntity> {
        return await this.museumRepository.save(museum);
    }

    async update(id: string, museum: MuseumEntity): Promise<MuseumEntity> {
        const persistedMuseum = await this.museumRepository.findOne({ where: { id } });
        if (!persistedMuseum) {
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        }
        return await this.museumRepository.save({ ...persistedMuseum, ...museum });
    }

    async delete(id: string): Promise<void> {
        const museum = await this.museumRepository.findOne({ where: { id } });
        if (!museum) {
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.museumRepository.delete(id);
    }

}
