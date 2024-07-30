import { createServer, IncomingMessage, ServerResponse } from "http";
import { createConnection } from "./database";
import { createUser, getUserById, getUsers } from "./users";

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  const [_, resource, resourceId] = req.url?.split("/") || [];

  if (resource !== "users") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ massage: "Not Found" }));
    return;
  }

  const DECIMAL_RADIX = 10; // Named constant for the radix
  const id = resourceId ? parseInt(resourceId, DECIMAL_RADIX) : null;

  console.log("req.method:", req.method);
  switch (req.method) {
    case "GET":
      id ? await getUserById(id, res) : await getUsers(res);
      break;
    case "POST":
      await createUser(req, res);
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
