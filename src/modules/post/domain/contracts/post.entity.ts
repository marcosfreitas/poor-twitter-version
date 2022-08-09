import { User } from 'src/modules/user/domain/contracts/user.entity';
import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostTypes } from './post-types';

/**
 * Post's model and entity definition.
 */
@Entity({ name: 'posts' })
export class Post {
  /**
   * Defined as string because number is not compatible with bigint
   */
  @PrimaryColumn({ type: 'bigint' })
  @Generated('increment')
  id: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  repostedId?: string;

  type?: PostTypes;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column({ length: 777 })
  content: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  constructor(user?: User, content?: string, repostedId?: string) {
    this.user = user;
    this.content = content;
    this.repostedId = repostedId;
  }
}
