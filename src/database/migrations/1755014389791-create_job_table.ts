import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobTable1755014389791 implements MigrationInterface {
    name = 'CreateJobTable1755014389791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_id" character varying NOT NULL, "title" character varying NOT NULL, "city" character varying, "state" character varying, "remote" boolean NOT NULL DEFAULT false, "job_type" character varying, "min_salary" integer, "max_salary" integer, "currency" character varying, "company_name" character varying NOT NULL, "company_industry" character varying, "experience" integer, "skills" text array, "posted_date" TIMESTAMP NOT NULL, "source" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "metadata" jsonb, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_372290d430122b510ba5d0a3d8" ON "job" ("posted_date") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0115c5dfd644ea8d08433446fc" ON "job" ("external_id", "source") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0115c5dfd644ea8d08433446fc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_372290d430122b510ba5d0a3d8"`);
        await queryRunner.query(`DROP TABLE "job"`);
    }

}
