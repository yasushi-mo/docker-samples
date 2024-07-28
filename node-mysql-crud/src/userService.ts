import { createConnection } from "./database";
import { User } from "./type";

export const getUsers = async () => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("select * from users");
    await connection.end();
    return rows;
  } catch (error) {
    console.error("getUsers failed: ", JSON.stringify(error));
  }
};
