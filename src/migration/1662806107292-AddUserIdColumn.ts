import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdColumn1662806107292 implements MigrationInterface {
    name = 'AddUserIdColumn1662806107292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "userid" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "userid"`);
    }

}
