import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RedisService } from 'src/redis/redis.service';
import UserSchema, { User } from './entities/user.entity';

// Mock the UserModel provider
const mockUserModel: jest.Mock = jest.fn();

jest.mock('../utils/validations/schemaValidation', () => ({
  validateSchema: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(async () => {
    jest.clearAllMocks();
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
