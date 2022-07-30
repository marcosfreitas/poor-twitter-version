import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePostsTable1659100462289 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isUnique: true,
            unsigned: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'uuid',
            type: 'varchar',
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'uuid',
          }),
          new TableColumn({
            name: 'reposted_id',
            type: 'bigint',
            unsigned: true,
            isNullable: true,
          }),
          new TableColumn({
            name: 'user_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'content',
            type: 'varchar(777)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_content',
            columnNames: ['content'],
            isFulltext: true,
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts');
  }
}
