import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { MuseumService } from './museum.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { MuseumDto } from './museum.dto/museum.dto';
import { plainToInstance } from 'class-transformer';
import { MuseumEntity } from './museum.entity/museum.entity';

@Controller('museum')
@UseInterceptors(BusinessErrorsInterceptor)
export class MuseumController {
    constructor(private readonly museumService: MuseumService) { }

    @Get()
    async findAll(
        @Query('city') city: string,
        @Query('name') name: string,
        @Query('foundedBefore') foundedBefore: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.museumService.findAll(city, name, foundedBefore, page, limit);
    }

    @Get(':museumId')
    async findOne(@Param('museumId') museumId: string) {
        return await this.museumService.findOne(museumId);
    }
    @Post()
    async create(@Body() museumDto: MuseumDto) {
        const museum: MuseumEntity = plainToInstance(MuseumEntity, museumDto);
        return await this.museumService.create(museum);
    }

    @Put(':museumId')
    async update(@Param('museumId') museumId: string, @Body() museumDto: MuseumDto) {
        const museum: MuseumEntity = plainToInstance(MuseumEntity, museumDto);
        return await this.museumService.update(museumId, museum);
    }

    @Delete(':museumId')
    @HttpCode(204)
    async remove(@Param('museumId') museumId: string) {
        return await this.museumService.delete(museumId);
    }


}
