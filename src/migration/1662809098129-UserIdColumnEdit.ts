import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdColumnEdit1662809098129 implements MigrationInterface {
    name = 'UserIdColumnEdit1662809098129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "userid"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "userid" character varying NOT NULL`);
    }

}
