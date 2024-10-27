import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1730036782664 implements MigrationInterface {
    name = 'InitDb1730036782664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activities_actions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "action_log_key" character varying, "content" character varying, CONSTRAINT "UQ_279e7752bedea6b22fc9e7b2e11" UNIQUE ("action_log_key"), CONSTRAINT "PK_6ff577647fe97037279e55d7f8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mediafiles" ("id" character varying NOT NULL, "name" character varying, "key_name" character varying, "physical_path" character varying, "mime_type" character varying, "size" integer, "extension" character varying, "variants" jsonb, "status" integer, "type" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1a7e39eb82b44be4ea157b4b0a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying, "parent_id" integer, "type" integer, "extra" jsonb NOT NULL DEFAULT '{}', "logs" jsonb NOT NULL DEFAULT '{}', "area_id" integer, "key" character varying, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "members" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying, "guardian_name" character varying, "phone" character varying, "password" character varying, "address" character varying, "cmnd" character varying, "email" character varying, "gender" integer, "city_id" integer, "birthday" date, "status" integer DEFAULT '1', "type" integer DEFAULT '1', "avatar_id" character varying, "images" jsonb DEFAULT '{}', "token_info" jsonb DEFAULT '{"app":"-"}', CONSTRAINT "UQ_090c60f7851c98387ce3e1995ef" UNIQUE ("phone"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2e9903f9aa7c7e15e7d268634a" ON "members" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_090c60f7851c98387ce3e1995e" ON "members" ("phone") `);
        await queryRunner.query(`CREATE TABLE "members_logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "object_id" integer, "reason" character varying, "column" character varying, "old_data" jsonb DEFAULT '{}', "new_data" jsonb DEFAULT '{}', "creator_info" jsonb DEFAULT '{}', CONSTRAINT "PK_b29d073ce9b4132346deaaef203" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "members_transactions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "member_id" integer, "type" integer, CONSTRAINT "PK_556359b4bc219896f8ee973dd45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "phone" character varying, "code" character varying, "token" jsonb DEFAULT '{}', "type" integer, "status" integer DEFAULT '1', "ip" character varying, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_33206384cc0a56e1d8d0a0cc47" ON "otps" ("phone") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying, "email" character varying, "phone" character varying, "password" character varying, "address" character varying, "gender" integer, "birthday" character varying, "status" integer DEFAULT '1', "type" integer DEFAULT '1', "images" jsonb DEFAULT '{}', "token_info" jsonb DEFAULT '{}', "login_info" jsonb DEFAULT '{}', "creator_id" integer, "creator_info" jsonb DEFAULT '{}', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "rbac_modules" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "key" character varying, "name" character varying, "status" integer DEFAULT '1', "creator_id" integer, "creator_info" jsonb DEFAULT '{}', CONSTRAINT "PK_e1554f2ac07918ebed171d8ed94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rbac_actions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "key" character varying, "name" character varying, "module_id" integer, "status" integer DEFAULT '1', "type" integer DEFAULT '1', "creator_id" integer, "creator_info" jsonb DEFAULT '{}', CONSTRAINT "PK_190032a075ab676476d2f6749e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rbac_roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying, "status" integer DEFAULT '1', "creator_id" integer, "creator_info" jsonb DEFAULT '{}', CONSTRAINT "PK_b5f28376a8596e5361fbb5734e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_166a60f00008e532804fcfd188" ON "rbac_roles" ("name") `);
        await queryRunner.query(`CREATE TABLE "system_config_logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "object_id" integer, "reason" character varying, "column" character varying, "old_data" jsonb DEFAULT '{}', "new_data" jsonb DEFAULT '{}', "creator_info" jsonb DEFAULT '{}', CONSTRAINT "PK_3c9a4ab9101435754d5eb664d80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system_config" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" jsonb, "type" integer, "status" integer DEFAULT '1', CONSTRAINT "UQ_7215292e848f2a707db9c547b9b" UNIQUE ("type"), CONSTRAINT "PK_db4e70ac0d27e588176e9bb44a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "third_party_responses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "transaction_id" integer, "member_id" integer, "type" integer, "status" integer, "request" jsonb DEFAULT '{}', "response" jsonb DEFAULT '{}', CONSTRAINT "PK_3dff0270a44724fb6211859311c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ab682c2e88b30d84297117932c" ON "third_party_responses" ("type") `);
        await queryRunner.query(`CREATE TABLE "users_logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "object_id" integer, "reason" character varying, "column" character varying, "old_data" jsonb DEFAULT '{}', "new_data" jsonb DEFAULT '{}', "creator_info" jsonb DEFAULT '{}', CONSTRAINT "PK_d9d01138a8557ea3e86c8290df3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "action_log_key" character varying, "content" character varying, "link" character varying, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_eebaffddb3c6e049fa709e7de02" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rbac_modules" ADD CONSTRAINT "FK_c5100bcab4f4eb8bda674c8e07a" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rbac_actions" ADD CONSTRAINT "FK_7935a286c6c37935663bf661f97" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rbac_actions" ADD CONSTRAINT "FK_55ab9d87256badb151910d1a3aa" FOREIGN KEY ("module_id") REFERENCES "rbac_modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rbac_roles" ADD CONSTRAINT "FK_228822f2cb483d39485858ef6c6" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_b82f1d8368dd5305ae7e7e664c2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_b82f1d8368dd5305ae7e7e664c2"`);
        await queryRunner.query(`ALTER TABLE "rbac_roles" DROP CONSTRAINT "FK_228822f2cb483d39485858ef6c6"`);
        await queryRunner.query(`ALTER TABLE "rbac_actions" DROP CONSTRAINT "FK_55ab9d87256badb151910d1a3aa"`);
        await queryRunner.query(`ALTER TABLE "rbac_actions" DROP CONSTRAINT "FK_7935a286c6c37935663bf661f97"`);
        await queryRunner.query(`ALTER TABLE "rbac_modules" DROP CONSTRAINT "FK_c5100bcab4f4eb8bda674c8e07a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_eebaffddb3c6e049fa709e7de02"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TABLE "users_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab682c2e88b30d84297117932c"`);
        await queryRunner.query(`DROP TABLE "third_party_responses"`);
        await queryRunner.query(`DROP TABLE "system_config"`);
        await queryRunner.query(`DROP TABLE "system_config_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_166a60f00008e532804fcfd188"`);
        await queryRunner.query(`DROP TABLE "rbac_roles"`);
        await queryRunner.query(`DROP TABLE "rbac_actions"`);
        await queryRunner.query(`DROP TABLE "rbac_modules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33206384cc0a56e1d8d0a0cc47"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "members_transactions"`);
        await queryRunner.query(`DROP TABLE "members_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_090c60f7851c98387ce3e1995e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2e9903f9aa7c7e15e7d268634a"`);
        await queryRunner.query(`DROP TABLE "members"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "mediafiles"`);
        await queryRunner.query(`DROP TABLE "activities_actions"`);
    }

}
