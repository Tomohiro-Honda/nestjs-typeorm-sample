import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserStatus } from '../auth/user-status.enum';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { ItemsService } from './items.service';
import { ItemStatus } from './item-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUser1 = {
  id: '1',
  username: 'user1',
  password: '1234',
  sattus: UserStatus.PREMIUM,
};

const mockUser2 = {
  id: '2',
  username: 'user2',
  password: '1234',
  sattus: UserStatus.FREE,
};

describe('ItemsServiceTest', () => {
  let itemsService;
  let itemRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useClass: Repository,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  describe('findAll', () => {
    it('正常系', async () => {
      const expected = [];
      jest
        .spyOn(itemRepository, 'find')
        .mockImplementation(async () => expected);
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const expected = {
        id: 'test-id',
        name: 'Camera',
        price: 10000,
        describe: 'NikonF',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
      };
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => expected);
      const result = await itemsService.findById('test-id');
      expect(result).toEqual(expected);
    });

    it('異常系:商品が見つからない', async () => {
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => null);
      await expect(itemsService.findById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const input = {
        name: 'Camera',
        price: 10000,
        description: 'NikonF',
      };
      const expected = {
        id: 'test-id',
        name: 'Camera',
        price: 10000,
        describe: 'NikonF',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };
      jest
        .spyOn(itemRepository, 'create')
        .mockImplementation(async () => expected);
      jest
        .spyOn(itemRepository, 'save')
        .mockImplementation(async () => expected);
      const result = await itemsService.create(input, mockUser1);
      expect(result).toEqual(expected);
    });
  });

  describe('updateStatus', () => {
    const mockItem = {
      id: 'test-id',
      name: 'Camera',
      price: 10000,
      describe: 'NikonF',
      status: ItemStatus.ON_SALE,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    const mockUpdateResult = {
      affected: 1,
    };

    it('正常系', async () => {
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => mockItem);
      jest
        .spyOn(itemRepository, 'update')
        .mockImplementation(async () => mockUpdateResult);
      await itemsService.updateStatus('test-id', mockUser2);
      expect(itemRepository.update).toHaveBeenCalled();
    });

    it('異常系:自身の商品を購入', async () => {
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => mockItem);
      jest
        .spyOn(itemRepository, 'update')
        .mockImplementation(async () => mockUpdateResult);
      await expect(
        itemsService.updateStatus('test-id', mockUser1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const price = 2000;
    const input = {
      price: price,
    };
    const mockItem = {
      id: 'test-id',
      name: 'Camera',
      price: price,
      describe: 'NikonF',
      status: ItemStatus.ON_SALE,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    const mockUpdateResult = {
      affected: 1,
    };

    it('正常系', async () => {
      jest
        .spyOn(itemRepository, 'update')
        .mockImplementation(async () => mockUpdateResult);
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => mockItem);
      await itemsService.update('test-id', input, mockUser1);
      expect(itemRepository.update).toHaveBeenCalled();
    });

    it('異常系:他のユーザーの商品を変更', async () => {
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => mockItem);
      jest
        .spyOn(itemRepository, 'update')
        .mockImplementation(async () => mockUpdateResult);
      await expect(
        itemsService.update('test-id', input, mockUser2),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    const mockItem = {
      id: 'test-id',
      name: 'Camera',
      price: 10000,
      describe: 'NikonF',
      status: ItemStatus.ON_SALE,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    const mockDeleteResult = {
      affected: 1,
    };

    it('正常系', async () => {
      jest
        .spyOn(itemRepository, 'delete')
        .mockImplementation(async () => mockDeleteResult);
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => mockItem);
      await itemsService.delete('test-id', mockUser1);
      expect(itemRepository.delete).toHaveBeenCalled();
    });

    it('異常系:自身の商品を購入', async () => {
      jest
        .spyOn(itemRepository, 'findOneBy')
        .mockImplementation(async () => mockItem);
      jest
        .spyOn(itemRepository, 'delete')
        .mockImplementation(async () => mockDeleteResult);
      await expect(itemsService.delete('test-id', mockUser2)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
