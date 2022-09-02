import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemStatus } from './item-status.enum';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}
  private items: Item[] = [];

  findAll(): Item[] {
    return this.items;
  }

  findById(id: string): Item {
    const found = this.items.find((item) => item.id === id);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemRepository
      .save({
        ...createItemDto,
        status: ItemStatus.ON_SALE,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Item)
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
  }

  updateStatus(id: string): Item {
    const item = this.findById(id);
    item.status = ItemStatus.SOLD_OUT;
    return item;
  }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
