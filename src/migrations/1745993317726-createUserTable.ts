import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1745993317726 implements MigrationInterface {
    name = 'CreateUserTable1745993317726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profileImage" character varying, "phoneNumber" character varying, "address" character varying, "profileImageMimeType" character varying, "role" character varying NOT NULL DEFAULT 'user', "refreshToken" character varying, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
