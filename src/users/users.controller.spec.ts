import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    mockUsersService.findAll.mockResolvedValue([]);
    const result = await controller.findAll();
    expect(result).toEqual([]);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it('should call create', async () => {
    const dto = { name: 'Juan', email: 'juan@email.com' };
    const expected = { id: 1, ...dto, createdAt: new Date() };
    mockUsersService.create.mockResolvedValue(expected);
    const result = await controller.create(dto);
    expect(result).toEqual(expected);
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });
});