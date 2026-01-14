import { Pool } from "pg";

export const pool = new Pool({
  user: 'admin',
  password: 'WZrohwTGQbc3B9CFN6sVJlxhoYUy5deZ',
  host: 'dpg-d5gamdmuk2gs739do9f0-a.singapore-postgres.render.com', // db คือชื่อ service ที่กำหนดใน docker-compose.yml
  port: 5432, // 5432
  database: 'donationapp_db',
  ssl: { rejectUnauthorized: false }
});
