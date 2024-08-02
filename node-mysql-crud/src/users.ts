import { IncomingMessage, ServerResponse } from "http";
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

const parseBody = (req: IncomingMessage): Promise<Omit<User, "id">> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      // Convert the chunk to a string and append it to the body
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        // Parse the accumulated body as JSON
        const parseBody: Omit<User, "id"> = JSON.parse(body);
        resolve(parseBody);
      } catch (error) {
        // Reject the promise if parsing fails
        reject(error);
      }
    });
  });
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
    const [users] = await connection.query<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    connection.end();
    const user = users[0];

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

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const user: Omit<User, "id"> = await parseBody(req);

    const connection = await createConnection();
    await connection.query("INSERT INTO users (name, email) VALUES (?, ?)", [
      user.name,
      user.email,
    ]);
    connection.end();

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User created" }));
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (
  id: number,
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const connection = await createConnection();

    const [targetUsers] = await connection.query<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    const targetUser = targetUsers[0];

    if (!targetUser) {
      connection.end();
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
      return;
    }

    const user: Omit<User, "id"> = await parseBody(req);
    await connection.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [user.name, user.email, id]
    );
    connection.end();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User updated" }));
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteUser = async (id: number, res: ServerResponse) => {
  try {
    const connection = await createConnection();

    const [targetUsers] = await connection.query<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    const targetUser = targetUsers[0];

    if (!targetUser) {
      connection.end();
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
      return;
    }

    await connection.query("DELETE FROM users WHERE id = ?", [id]);
    connection.end();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User deleted" }));
  } catch (error) {
    handleError(res, error);
  }
};
