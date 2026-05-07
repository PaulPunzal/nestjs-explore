import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

// fake version of PrismaService
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // reset all mocks before each test so they don't bleed into each other
    jest.clearAllMocks();
  });

  // --- CREATE ---
  describe('create', () => {
    it('should create a user', async () => {
      // Arrange
      const dto = { name: 'Juan', email: 'juan@email.com' };
      const expected = { id: 1, ...dto, createdAt: new Date() };
      mockPrismaService.user.create.mockResolvedValue(expected);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(result).toEqual(expected);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  // --- FIND ALL ---
  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const expected = [
        { id: 1, name: 'Juan', email: 'juan@email.com', createdAt: new Date() },
        { id: 2, name: 'Maria', email: 'maria@email.com', createdAt: new Date() },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(expected);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expected);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  // --- FIND ONE ---
  describe('findOne', () => {
    it('should return a user if found', async () => {
      // Arrange
      const expected = { id: 1, name: 'Juan', email: 'juan@email.com', createdAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(expected);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange — return null to simulate no user found
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // --- REMOVE ---
  describe('remove', () => {
    it('should delete a user', async () => {
      // Arrange
      const user = { id: 1, name: 'Juan', email: 'juan@email.com', createdAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.user.delete.mockResolvedValue(user);

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result).toEqual(user);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});