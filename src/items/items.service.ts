import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemStatus } from './item-status.enum';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from '../entities/item.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
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

  async create(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const { name, price, description } = createItemDto;
    try {
      const saveItem = await this.itemRepository.create({
        name,
        price,
        description,
        status: ItemStatus.ON_SALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        user,
      } as unknown as Item);

      return await this.itemRepository.save(saveItem);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateStatus(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    if (item.userId === user.id) {
      throw new BadRequestException(
        '自身が出品した商品を購入することは出来ません。',
      );
    }
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

  async update(
    id: string,
    updateItemDto: UpdateItemDto,
    user: User,
  ): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    if (item.userId !== user.id) {
      throw new BadRequestException(
        '他のユーザーが出品した商品の変更はできません。',
      );
    }
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

  async delete(id: string, user: User): Promise<DeleteResult> {
    const item = await this.findById(id);
    if (item.userId !== user.id) {
      throw new BadRequestException(
        '他のユーザーが出品した商品は削除できません。',
      );
    }
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
