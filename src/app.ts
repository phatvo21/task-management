import { registerAlias } from "./utils/ModuleAlias";
registerAlias(__dirname, [
   "services",
   "utils",
   "databases",
   "databases/entities",
   "databases/migrations",
   "repositories",
   "components",
   "helpers",
   "middlewares",
   "logging",
   "consoles",
   "constants",
]);
import { Server } from "./server";

new Server();
