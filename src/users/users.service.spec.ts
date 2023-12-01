import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


// Mock user data for testing
const mockUser: User = {
  id: '1',
  name: 'John',
  surname: 'Doe',
  age: 30,
  email: 'john.doe@example.com',
  phoneNumber: '1234567890',
  login: 'johndoe',
  password: 'password123',
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({ ...mockUser, id: '1' });

      const result = await service.create(mockUser);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { login: mockUser.login } });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ ...mockUser, id: '1' });
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({ ...mockUser, id: '1' });

      await expect(service.create(mockUser)).rejects.toThrowError('User is already exist');
    });
  });
});
