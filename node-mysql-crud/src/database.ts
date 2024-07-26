import mysql from "mysql2/promise";

export const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("Connected to database");
    return connection;
  } catch (error) {
    console.error("Failed to connecting to database", JSON.stringify(error));
    process.exit(1);
  }
};
