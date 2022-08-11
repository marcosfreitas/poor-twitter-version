import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
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
    month: 'long',
  }).format(date);
  const day = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
  }).format(date);
  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(date);

  return `${month} ${day}, ${year}`;
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

describe('/v1/users/:uuid (GET) - when listing a user', () => {
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
  });

  beforeEach(async () => {
    await postRepository.delete({});
    await userRepository.delete({});

    user = new User(randomUUID(), `User-${Math.random().toFixed(5)}`);
    await userRepository.insert(user);
    await createDailyPosts(postRepository, user);
  });

  afterAll(async () => {
    await postRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });

  describe('and is filtering by user uuid', () => {
    it('should return NOT_FOUND for not found user', async () => {
      await request(app.getHttpServer())
        .get(`/v1/users/${randomUUID()}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return BAD_REQUEST for invalid user uuid', async () => {
      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
      };

      const response = await request(app.getHttpServer())
        .get(`/v1/users/invalid-uuid`)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(expectedResponse);
    });

    it('should return user data with certain formatted structure', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/users/${user.uuid}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('data');

      expect(response.body.data).toHaveProperty('profile');
      expect(response.body.data.profile).toHaveProperty('uuid');
      expect(response.body.data.profile).toHaveProperty('username');
      expect(response.body.data.profile).toHaveProperty('id');
      expect(response.body.data.profile).toHaveProperty('joinedAt');
      expect(response.body.data.profile).toHaveProperty('updatedAt');

      expect(response.body.data).toHaveProperty('publishedPosts');

      expect(Object.keys(response.body.data).length).toBe(2);
      expect(response.body.data.profile.joinedAt).toBe(
        formatDate(user.createdAt),
      );
      expect(response.body.data.profile.updatedAt).toBe(
        formatDate(user.updatedAt),
      );
      expect(response.body.data.publishedPosts).toBe(4);
    });
  });
});
