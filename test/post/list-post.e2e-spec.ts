import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MoreThan, Repository } from 'typeorm';
import { Post } from '@app/modules/post/domain/contracts/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@app/modules/user/domain/contracts/user.entity';
import { randomUUID } from 'crypto';

const getDaysAgo = (days: number) => {
  const oneDayTimestamp = 24 * 60 * 60 * 1000;
  const todayTimestamp = Date.now();

  return new Date(todayTimestamp - oneDayTimestamp * days);
};

const formatDate = (date: Date): string => {
  const month = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
  }).format(date);
  const day = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
  }).format(date);
  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(date);

  return `${year}-${month}-${day}`;
};

const createDailyPosts = async (repository: Repository<Post>, user: User) => {
  const posts: [Post, Date][] = [
    [new Post(user, '10 days ago post'), getDaysAgo(10)],
    [new Post(user, '5 days ago post'), getDaysAgo(5)],
    [new Post(user, '3 days ago post'), getDaysAgo(3)],
    [new Post(user, 'yesterday post'), getDaysAgo(1)],
  ];

  for (let i = 0; i < posts.length; i++) {
    const [post, date] = posts[i];

    post.createdAt = date;
    post.updatedAt = date;

    await repository.insert(post);
  }
};

describe('/v1/posts (GET) - when listing a posts', () => {
  let app: INestApplication;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  let user: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    postRepository = app.get(getRepositoryToken(Post));
    userRepository = app.get(getRepositoryToken(User));

    await app.init();

    await postRepository.delete({});
    await userRepository.delete({});

    user = new User(randomUUID(), `User-${Math.random().toFixed(5)}`);
    await userRepository.insert(user);

    await createDailyPosts(postRepository, user);
  });

  afterAll(async () => {
    // await postRepository.delete({});
    // await userRepository.delete({});
    await app.close();
  });

  describe.only('and is not using filters', () => {
    it('should return all posts with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .expect(HttpStatus.OK);

      console.log(response.body.data);

      expect(response.body.data.length).toBe(4);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(4);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });
  });

  describe('and is filtering by user uuid', () => {
    it('should return NOT_FOUND for not found user', async () => {
      await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          userUuid: randomUUID(),
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return BAD_REQUEST for invalid user uuid', async () => {
      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['userUuid must be a UUID'],
        error: 'Bad Request',
      };

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          userUuid: 'invalid',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(expectedResponse);
    });

    it('should return NOT_FOUND for not found user', async () => {
      await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          userUuid: randomUUID(),
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return posts only for this user', async () => {
      // adding another user and creating posts for this user
      const anotherUser = new User(
        randomUUID(),
        `User-${Math.random().toFixed(5)}`,
      );
      await userRepository.insert(anotherUser);

      await createDailyPosts(postRepository, anotherUser);

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          userUuid: anotherUser.uuid,
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(4);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(4);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });
  });

  describe('and is filtering by date range', () => {
    it('should return BAD_REQUEST for invalid date filter', async () => {
      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['dateTo must be a valid ISO 8601 date string'],
        error: 'Bad Request',
      };

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          dateTo: 'invalid',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(expectedResponse);
    });

    it('should return posts using only dateFrom filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          dateFrom: formatDate(getDaysAgo(3)),
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(2);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(2);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });

    it('should return posts using only dateTo filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          dateTo: formatDate(getDaysAgo(10)),
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(1);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(1);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });

    it('should return posts using dateFrom and dateTo filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          dateFrom: formatDate(getDaysAgo(10)),
          dateTo: formatDate(getDaysAgo(3)),
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(3);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });

    it('should return OK for an empty list of not found posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          dateFrom: formatDate(getDaysAgo(30)),
          dateTo: formatDate(getDaysAgo(20)),
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(0);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(0);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(0);
    });
  });

  describe('and is using the take param with paginated results', () => {
    it('should return BAD_REQUEST for invalid value', async () => {
      // controlling the quantity of posts in the database
      await postRepository.delete({});
      await createDailyPosts(postRepository, user);

      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['take must be a number string'],
        error: 'Bad Request',
      };

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          take: 'invalid',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(expectedResponse);
    });

    it('should keep working for negative values', async () => {
      // controlling the quantity of posts in the database
      await postRepository.delete({});
      await createDailyPosts(postRepository, user);

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          take: -1,
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(4);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(4);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(1);
    });

    it('should not exceed the maximum allowed of chunks during pagination', async () => {
      // controlling the quantity of posts in the database
      await postRepository.delete({});

      for (let i = 0; i < 50; i++) {
        await createDailyPosts(postRepository, user);
      }

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          take: 50,
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(10);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(200);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(20);
    });

    it('should return posts only desired quantity', async () => {
      // controlling the quantity of posts in the database
      await postRepository.delete({});
      await createDailyPosts(postRepository, user);

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          take: 3,
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(3);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(4);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBe(2);
    });

    it('should return posts only desired quantity and use the param page to get next page', async () => {
      // controlling the quantity of posts in the database
      await postRepository.delete({});
      await createDailyPosts(postRepository, user);

      const response = await request(app.getHttpServer())
        .get('/v1/posts')
        .query({
          take: 1,
          page: 3,
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBe(1);

      expect(response.body).toHaveProperty('totalRecords');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');

      expect(response.body.totalRecords).toBe(4);
      expect(response.body.page).toBe(3);
      expect(response.body.totalPages).toBe(4);
    });
  });
});
