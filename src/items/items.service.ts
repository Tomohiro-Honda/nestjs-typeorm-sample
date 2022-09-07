import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemStatus } from './item-status.enum';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from '../entities/item.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @Inject('ITEM_REPOSITORY')
    private itemRepository: Repository<Item>,
  ) {}

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find().catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }

  async findById(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(
        `${id}に一致するデータが見つかりませんでした。`,
      );
    }
    return item;
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { name, price, description } = createItemDto;
    try {
      const saveItem = await this.itemRepository.create({
        name,
        price,
        description,
        status: ItemStatus.ON_SALE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CreateItemDto);

      return await this.itemRepository.save(saveItem);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateStatus(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    const updatedItem = {
      ...item,
      status: ItemStatus.SOLD_OUT,
      updatedAt: new Date(),
    } as unknown as Item;
    await this.itemRepository.update(id, updatedItem).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    return updatedItem;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    const { name, price, description } = updateItemDto;
    const updatedItem = {
      ...item,
      name,
      price,
      description,
      updatedAt: new Date(),
    } as unknown as Item;
    await this.itemRepository.update(id, updatedItem).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    return updatedItem;
  }

  async delete(id: string): Promise<DeleteResult> {
    const response = await this.itemRepository.delete(id).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
    if (!response.affected) {
      throw new NotFoundException(
        `${id}に一致するデータが見つかりませんでした。`,
      );
    }
    return response;
  }
}
