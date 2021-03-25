import { getConnection } from "typeorm";
import { promises as fs } from "fs";
import { join } from "path";

const databaseDisconnect = async (): Promise<void> => {
   const databasename = ":memory";
   const path = join(process.cwd(), databasename);
   await getConnection().close();
   return fs.unlink(path);
};
export { databaseDisconnect };
