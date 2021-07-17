import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export default class Task1616698721105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'int',
            width: 11,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {name: 'title', type: 'varchar', length: '255', isNullable: false},
          {name: 'description', type: 'text', isNullable: true},
          {name: 'task_identity', type: 'varchar', length: '255', isNullable: false},
          {name: 'status', type: 'enum', enum: ['pending', 'completed'], isNullable: true},
          {name: 'created_at', type: 'datetime', isNullable: true},
          {name: 'updated_at', type: 'datetime', isNullable: true},
        ],
      }),
      true,
      false,
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks');
  }
}
