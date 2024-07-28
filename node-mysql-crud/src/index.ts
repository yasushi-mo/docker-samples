import { createServer } from "http";
import { createConnection } from "./database";

const server = createServer();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  createConnection();
});
