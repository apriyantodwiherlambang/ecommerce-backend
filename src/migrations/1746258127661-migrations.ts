import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1746258127661 implements MigrationInterface {
  name = 'Migrations1746258127661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Menambahkan kolom 'price' dengan nilai default
    await queryRunner.query(
      `ALTER TABLE "product" ADD "price" integer DEFAULT 0`,
    );

    // Mengubah kolom 'price' menjadi 'NOT NULL'
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "price" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Menghapus kolom 'price' jika migrasi dibatalkan
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
  }
}
