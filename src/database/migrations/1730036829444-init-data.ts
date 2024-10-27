import { MigrationInterface, QueryRunner } from "typeorm"

export class InitData1730036829444 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO users("name","email","password") VALUES ('admin','admin@gmail.com','$2b$10$KwjK5Gw4wavXPbMeTsCr2OM6537f4cN0DyHLRzlZKCelLvXWbMRmm')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
