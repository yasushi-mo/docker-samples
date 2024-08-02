import { RowDataPacket } from "mysql2";

export type User = RowDataPacket & {
  id: string;
  name: string;
  email: string;
};
