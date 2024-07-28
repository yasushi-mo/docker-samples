import { createServer, IncomingMessage, ServerResponse } from "http";
import { createConnection } from "./database";
import { getUsers } from "./users";

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  const [_, resource] = req.url?.split("/") || [];

  if (resource !== "users") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ massage: "Not Found" }));
    return;
  }

  switch (req.method) {
    case "GET":
      await getUsers(res);
      break;
    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ massage: "Not Found" }));
  }
};

const server = createServer(handleRequest);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  createConnection();
});
