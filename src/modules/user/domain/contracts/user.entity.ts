import { Post } from 'src/modules/post/domain/contracts/post.entity';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';

/**
 * User's model and entity definition.
 */
@Entity({ name: 'users' })
export class User {
  /**
   * Defined as string because number is not compatible with bigint in postgresql
   */
  @PrimaryColumn({ type: 'bigint' })
  @Generated('increment')
  id: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ length: 14 })
  username: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
