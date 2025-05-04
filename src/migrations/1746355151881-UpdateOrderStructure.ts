import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderStructure1746355151881 implements MigrationInterface {
  name = 'UpdateOrderStructure1746355151881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD "status" varchar(255) NOT NULL DEFAULT 'pending'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP COLUMN "status"
    `);
  }
}
