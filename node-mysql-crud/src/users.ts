import { ServerResponse } from "http";
import { createConnection } from "./database";

export const getUsers = async (res: ServerResponse) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("select * from users");
    await connection.end();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  } catch (error) {
    console.error("getUsers failed: ", JSON.stringify(error));
  }
};
