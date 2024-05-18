# Microservice overview

There are 2 micro services and 1 API gateway.

1. service one
2. service two

&nbsp;

# Microservice setup

### Pre requisite

- Redis database with details like host, port, username and password
- Mongodb database for local development

## API gateway

- Add variables into .env file (Variables provided in .env.example file of API gateway folder)
- Run command `npm i` to install dependancy
- Run command `npm run start:dev` to start server of API gateway

## service one

- Add variables into .env file (Variables provided in .env.example file of service one folder)
- Run command `npm i` to install dependancy
- Run command `npm run start:dev` to start server of API gateway

## service two

- Add variables into .env file (Variables provided in .env.example file of service two)
- Run command `npm i` to install dependancy
- Run command `npm run start:dev` to start server of API gateway

&nbsp;

# Microservice setup references

### Microservice setup

- https://docs.nestjs.com/microservices/basics
- https://medium.com/@bharathi.r/nestjs-microservices-with-tcp-749043e46ef4
- https://stackoverflow.com/questions/55942795/call-my-nestjs-microservice-with-nodejs-app

### Test cases

- https://betterprogramming.pub/testing-controllers-in-nestjs-and-mongo-with-jest-63e1b208503c
- https://medium.com/@sergio.arrighi/jest-unit-testing-in-nestjs-and-mongoose-67ed1c809319

### Redis setup

- Create account in `https://redis.io/` and create new redis database
- https://medium.com/@mut1aq/using-redis-in-nestjs-8ca1a009670f
- https://stackoverflow.com/questions/74573177/in-nestjs-i-added-redis-as-cache-manager-when-i-specify-ttl-0-it-throws-a

&nbsp;

# Steps for creating new micro service

### Reference - https://medium.com/@bharathi.r/nestjs-microservices-with-tcp-749043e46ef4

1. Create new nest project using the command `nest new microservice-name`
2. Update main.ts file with desired port number

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        port: 3001,
      },
    },
    { inheritAppConfig: true }
  );
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
```

3. In API gateway register new client module

```typescript
 {
    name: NEW_MICROSERVICE_NAME,
    transport: Transport.TCP,
    options: { port: NEW_MICROSERVICE_PORT },
  }
```

4. Create folder in src with new micro service name and add modules and controllers related to new service in that folder
5. Create new controller, service and module inside newly created folder for new micro service
6. Inside the controller add health check controller to test that route of API gatewat and calling new service from API gateway is working properly

```typescript
  constructor(
    private readonly newService: NewService,
    @Inject(NEW_MICROSERVICE_NAME) private readonly newClient: ClientProxy,
  ) {}

  @Get('health-check')
  healthCheck() {
    return this.newService.healthCheck();
  }

  @Get('check-micro-service-health')
  checkMicroServiceHealth( @Response() response ) {
    return this.userClient.send(
      { cmd: 'check_micro_service_health' },
      { ...{ message: 'User micro service working' } },
    );
  }
```

7. In the newly created microservice create new resource with `nest new resource-name` and into the controller add message pattern to check the message and call different service accordingly.

```typescript
  @MessagePattern({ cmd: 'check_micro_service_health' })
  checkMicroServiceHealth(@Payload() payload): any {
    return this.newService.checkMicroServiceHealth(payload);
  }
```
