import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Repository } from 'typeorm';
import { Post } from '@app/modules/post/domain/contracts/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@app/modules/user/domain/contracts/user.entity';
import { randomUUID } from 'crypto';

describe('/v1/posts (POST) - when creating a posts', () => {
  let app: INestApplication;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  let user;

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
  });

  afterAll(async () => {
    await postRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });

  describe('and is sent a request without params', () => {
    it('should return BAD_REQUEST response with a body of missing params', () => {
      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'userUuid should not be null or undefined',
          'userUuid must be a UUID',
          'content should not be null or undefined',
          'content must be longer than or equal to 0 characters',
        ],
        error: 'Bad Request',
      };

      request(app.getHttpServer())
        .post('/v1/posts')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect(expectedResponse);
    });
  });

  describe('and is sent a request with content field longer than the maximum allowed', () => {
    it('should return BAD_REQUEST response with a body of content field too long', async () => {
      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['content must be shorter than or equal to 777 characters'],
        error: 'Bad Request',
      };

      const response = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: `🐞`.repeat(778),
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('and is sent a request with content field empty, a valid userUuid, but without repostedUuid', () => {
    it('should return BAD_REQUEST response', async () => {
      await userRepository.insert(user);

      const response = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe(
        "You can't create a post without content.",
      );
    });
  });

  describe('and is sent a request with userUuid that does not exists', () => {
    it('should return NOT_FOUND response', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: randomUUID(),
          content: '🐞 my user does not exists',
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe(
    'and is sent a request with a valid userUuid and content field, ' +
      'but ther user has reached daily post limit',
    () => {
      it('should return BAD_REQUEST response with a body of user reached daily post limit', async () => {
        await postRepository.delete({});
        await userRepository.insert(user);

        const posts = [
          new Post(user, '🐞 reaching daily post limit'),
          new Post(user, '🐞 reaching daily post limit'),
          new Post(user, '🐞 reaching daily post limit'),
          new Post(user, '🐞 reaching daily post limit'),
          new Post(user, '🐞 reaching daily post limit'),
        ];

        await postRepository.save(posts);

        const expectedResponse = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `User with uuid ${user.uuid} has reached daily post limit`,
          error: 'Bad Request',
        };

        const response = await request(app.getHttpServer())
          .post('/v1/posts')
          .send({
            userUuid: user.uuid,
            content: '🐞 reached daily post limit',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual(expectedResponse);
      });
    },
  );

  describe('and user tries to repost an unexistent post', () => {
    it('should return BAD_REQUEST response', async () => {
      const unexistentPostUuid = randomUUID();

      const expectedResponse = {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Reposted Post with uuid ${unexistentPostUuid} not found`,
        error: 'Not Found',
      };

      await userRepository.insert(user);

      const response = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '',
          repostedUuid: unexistentPostUuid,
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('and user tries to repost an unexistent post', () => {
    it('should return BAD_REQUEST response', async () => {
      const unexistentPostUuid = randomUUID();

      const expectedResponse = {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Reposted Post with uuid ${unexistentPostUuid} not found`,
        error: 'Not Found',
      };

      await userRepository.insert(user);

      const response = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐛 quoting this thing',
          repostedUuid: unexistentPostUuid,
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('and user tries to repost a reposted post', () => {
    it('should return BAD_REQUEST response', async () => {
      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `You can't repost a post that was already reposted`,
        error: 'Bad Request',
      };

      await userRepository.insert(user);

      const created = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐝 my daily post',
        })
        .expect(HttpStatus.CREATED);

      const reposted = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '',
          repostedUuid: created.body.data.uuid,
        })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '',
          repostedUuid: reposted.body.data.uuid,
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('and user tries to quote a quoted post', () => {
    it('should return BAD_REQUEST response', async () => {
      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `You can't quote a post that was already quoted`,
        error: 'Bad Request',
      };

      await userRepository.insert(user);

      const created = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐝 my daily post',
        })
        .expect(HttpStatus.CREATED);

      const quoted = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐼 my daily quote',
          repostedUuid: created.body.data.uuid,
        })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐞 quoting this quote',
          repostedUuid: quoted.body.data.uuid,
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('and user tries to repost a quoted post', () => {
    it('should return CREATED response', async () => {
      await userRepository.insert(user);

      const created = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐝 my daily post',
        })
        .expect(HttpStatus.CREATED);

      const quoted = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐱 quoting this post',
          repostedUuid: created.body.data.uuid,
        })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '',
          repostedUuid: quoted.body.data.uuid,
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('and user tries to quote a reposted post', () => {
    it('should return CREATED response', async () => {
      await userRepository.insert(user);

      const created = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐝 my daily post',
        })
        .expect(HttpStatus.CREATED);

      const reposted = await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '',
          repostedUuid: created.body.data.uuid,
        })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post('/v1/posts')
        .send({
          userUuid: user.uuid,
          content: '🐱 quoting this repost',
          repostedUuid: reposted.body.data.uuid,
        })
        .expect(HttpStatus.CREATED);
    });
  });
});
