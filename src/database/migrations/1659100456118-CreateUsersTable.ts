import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class CreateUsersTable1659100456118 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'username',
            type: 'varchar(14)',
            isNullable: false,
            isUnique: true,
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'datetime',
            default: 'now()',
            isNullable: false,
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()',
            isNullable: false,
          }),
        ],
        indices: [
          new TableIndex({
            name: 'idx_username',
            columnNames: ['username'],
            isFulltext: true,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
