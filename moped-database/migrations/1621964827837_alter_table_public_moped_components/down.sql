ALTER TABLE "public"."moped_components" DROP COLUMN "component_subtype";
ALTER TABLE "public"."moped_components" DROP COLUMN "line_representation";

ALTER TABLE "public"."moped_components" ALTER COLUMN "component_order" DROP NOT NULL;
ALTER TABLE "public"."moped_components" ADD COLUMN "date_added" timestamptz;
ALTER TABLE "public"."moped_components" ALTER COLUMN "date_added" DROP NOT NULL;
ALTER TABLE "public"."moped_components" ALTER COLUMN "date_added" SET DEFAULT clock_timestamp();
ALTER TABLE "public"."moped_components" ADD COLUMN "component_order" int4;

