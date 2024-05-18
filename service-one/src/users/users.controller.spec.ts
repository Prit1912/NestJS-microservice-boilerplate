import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Query, connect } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import UserSchema, { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name), // Use the name of your schema class
          useValue: userModel,
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            setWithExpiry: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    console.log(controller);
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    it('should return the saved object', async () => {
      const mockUserDto = {
        username: 'testuser',
        mobile: '9988552233',
        email: 'hihi@gmail.com',
      };
      const createdUser: any = await controller.create({ body: mockUserDto });
      // it should return created username same as we passed in payload
      expect(createdUser.username).toBe(mockUserDto.username);
    });

    it('should return error is email id is invalid', async () => {
      const mockUserDto = {
        username: 'testuser',
        mobile: '9988774455',
        email: 'hihigmail.com',
      };
      try {
        // it should throw error if email id is invalid
        await controller.create({ body: mockUserDto });
      } catch (error) {
        // error coming from joi validation
        expect(error.message).toContain(`\"email"\ must be a valid email`);
      }
    });

    it('should throw error if there is duplicate username', async () => {
      const mockUserDto = {
        username: 'testuser',
        mobile: '9988556644',
        email: 'hihi@gmail.com',
      };
      // create user once
      await controller.create({ body: mockUserDto });
      try {
        // create user again so it will throw error because multiple users cannot have same usernames
        await controller.create({ body: mockUserDto });
      } catch (error) {
        expect(error.message).toContain('duplicate');
        expect(error.message).toContain('username');
      }
    });
    it('should throw error if there is duplicate email', async () => {
      const mockUserDto1 = {
        username: 'testuser',
        mobile: '8855441122',
        email: 'testuser1@gmail.com',
      };
      const mockUserDto2 = {
        username: 'testuser1',
        mobile: '3322557744',
        email: 'testuser1@gmail.com',
      };
      // create user once
      await controller.create({ body: mockUserDto1 });
      try {
        // create user again so it will throw error because multiple users cannot have same email
        await controller.create({ body: mockUserDto2 });
      } catch (error) {
        expect(error.message).toContain('duplicate');
        expect(error.message).toContain('email');
      }
    });
  });
});
