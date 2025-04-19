CREATE TABLE "contact" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contact_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first" text,
	"last" text,
	"avatar" text,
	"twitter" text,
	"notes" text,
	"favorite" boolean
);
