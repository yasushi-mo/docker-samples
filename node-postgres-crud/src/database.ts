import { Client } from "pg";

export const createConnection = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log("Connected to database");
    return client;
  } catch (error) {
    console.error("Failed to connecting to database", JSON.stringify(error));
    process.exit(1);
  }
};
