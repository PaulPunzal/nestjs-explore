import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/user_crud?schema=public',
    url: process.env.DATABASE_URL ?? 'postgresql://user_crud_db_80ru_user:LRMM0hSKOchhE7uOBIOR96K6pTeVF6G6@dpg-d7u5k9jtqb8s739tbsv0-a.oregon-postgres.render.com/user_crud_db_80ru',
  },
});