/* eslint-disable prettier/prettier */
/*archivo src/museum/museum.service.spec.ts*/
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MuseumEntity } from './museum.entity/museum.entity';
import { MuseumService } from './museum.service';
import { faker } from '@faker-js/faker';

describe('MuseumService', () => {
  let service: MuseumService;
  let museumsList: MuseumEntity[];
  let repository: Repository<MuseumEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumService],
    }).compile();

    service = module.get<MuseumService>(MuseumService);
    repository = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    museumsList = [];
    for (let i = 0; i < 15; i++) {
      const museum: MuseumEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        address: faker.location.secondaryAddress(),
        city: faker.location.city(),
        image: faker.image.url(),
        foundedBefore: faker.number.int({ min: 1000, max: 2020 })
      })
      museumsList.push(museum);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all museums with default pagination (limit 10)', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result.data).toHaveLength(10);
    expect(result.total).toEqual(15);
    expect(result.page).toEqual(1);
    expect(result.totalPages).toEqual(2);
  });

  it('findAll should return museums by city', async () => {
    const museum: MuseumEntity = museumsList[0];
    const result = await service.findAll(museum.city);
    expect(result.data).not.toBeNull();
    expect(result.data.every(m => m.city === museum.city)).toBeTruthy();
  });

  it('findAll should return museums by name (partial match)', async () => {
    const museum: MuseumEntity = museumsList[0];
    const partialName = museum.name.substring(1, 4);
    const result = await service.findAll(undefined, partialName);
    expect(result.data).not.toBeNull();
    expect(result.data.every(m => m.name.toLowerCase().includes(partialName.toLowerCase()))).toBeTruthy();
  });

  it('findAll should return museums founded before a year', async () => {
    const year = 2000;
    const result = await service.findAll(undefined, undefined, year);
    expect(result.data).not.toBeNull();
    expect(result.data.every(m => m.foundedBefore < year)).toBeTruthy();
  });

  it('findAll should apply pagination limit correctly', async () => {
    const limit = 5;
    const result = await service.findAll(undefined, undefined, undefined, 1, limit);
    expect(result.data).toHaveLength(limit);
    expect(result.total).toEqual(15);
  });

  it('findAll should apply pagination page correctly', async () => {
    const limit = 10;
    const page = 2;
    const result = await service.findAll(undefined, undefined, undefined, page, limit);
    expect(result.data).toHaveLength(5);
    expect(result.page).toEqual(page);
  });

  it('findAll should combine filters and pagination', async () => {
    museumsList[0].city = "TestCity";
    museumsList[1].city = "TestCity";
    museumsList[2].city = "TestCity";
    await repository.save(museumsList[0]);
    await repository.save(museumsList[1]);
    await repository.save(museumsList[2]);

    const result = await service.findAll("TestCity", undefined, undefined, 1, 2);
    expect(result.data).toHaveLength(2);
    expect(result.total).toEqual(3);
    expect(result.data.every(m => m.city === "TestCity")).toBeTruthy();
  });

  it('findOne should return a museum by id', async () => {
    const storedMuseum: MuseumEntity = museumsList[0];
    const museum: MuseumEntity = await service.findOne(storedMuseum.id);
    expect(museum).not.toBeNull();
    expect(museum.name).toEqual(storedMuseum.name)
    expect(museum.description).toEqual(storedMuseum.description)
    expect(museum.address).toEqual(storedMuseum.address)
    expect(museum.city).toEqual(storedMuseum.city)
    expect(museum.image).toEqual(storedMuseum.image)
    expect(museum.foundedBefore).toEqual(storedMuseum.foundedBefore)
  });

  it('findOne should throw an exception for an invalid museum', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });

  it('create should return a new museum', async () => {
    const museum: MuseumEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      address: faker.location.secondaryAddress(),
      city: faker.location.city(),
      image: faker.image.url(),
      foundedBefore: faker.number.int({ min: 1000, max: 2020 }),
      exhibitions: [],
      artworks: []
    }

    const newMuseum: MuseumEntity = await service.create(museum);
    expect(newMuseum).not.toBeNull();

    const storedMuseum = await repository.findOne({ where: { id: newMuseum.id } })
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum!.name).toEqual(newMuseum.name)
    expect(storedMuseum!.description).toEqual(newMuseum.description)
    expect(storedMuseum!.address).toEqual(newMuseum.address)
    expect(storedMuseum!.city).toEqual(newMuseum.city)
    expect(storedMuseum!.image).toEqual(newMuseum.image)
    expect(storedMuseum!.foundedBefore).toEqual(newMuseum.foundedBefore)
  });

  it('update should modify a museum', async () => {
    const museum: MuseumEntity = museumsList[0];
    museum.name = "New name";
    museum.address = "New address";
    const updatedMuseum: MuseumEntity = await service.update(museum.id, museum);
    expect(updatedMuseum).not.toBeNull();
    const storedMuseum = await repository.findOne({ where: { id: museum.id } })
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum!.name).toEqual(museum.name)
    expect(storedMuseum!.address).toEqual(museum.address)
  });

  it('update should throw an exception for an invalid museum', async () => {
    let museum: MuseumEntity = museumsList[0];
    museum = {
      ...museum, name: "New name", address: "New address"
    }
    await expect(() => service.update("0", museum)).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });

  it('delete should remove a museum', async () => {
    const museum: MuseumEntity = museumsList[0];
    await service.delete(museum.id);
    const deletedMuseum = await repository.findOne({ where: { id: museum.id } })
    expect(deletedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid museum', async () => {
    const museum: MuseumEntity = museumsList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });

});