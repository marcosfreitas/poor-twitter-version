import { User } from 'src/modules/users/domain/contracts/user.entity';
import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Post's model and entity definition.
 */
@Entity()
export class Post {
  /**
   * Defined as string because number is not compatible with bigint in postgresql
   */
  @PrimaryColumn({ type: 'bigint' })
  @Generated('increment')
  id: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'reposted_id' })
  repostedId?: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column({ length: 777 })
  content: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
