import { ServerResponse } from "http";
import { createConnection } from "./database";
import { RowDataPacket } from "mysql2";

type User = RowDataPacket & {
  id: string;
  name: string;
  email: string;
};

const handleError = (res: ServerResponse, error: unknown) => {
  console.error("Error: ", error);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Internal Server Error" }));
};

export const getUsers = async (res: ServerResponse) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query<User[]>("SELECT * FROM users");
    await connection.end();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserById = async (id: number, res: ServerResponse) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    connection.end();
    const user = rows[0];

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    handleError(res, error);
  }
};
