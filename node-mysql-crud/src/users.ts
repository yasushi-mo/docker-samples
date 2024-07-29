import { ServerResponse } from "http";
import { createConnection } from "./database";

const handleError = (res: ServerResponse, error: unknown) => {
  console.error("Error: ", error);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Internal Server Error" }));
};

export const getUsers = async (res: ServerResponse) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("select * from users");
    await connection.end();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  } catch (error) {
    handleError(res, error);
  }
};
