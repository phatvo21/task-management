import { getConnection } from "typeorm";

const databaseDisconnect = async (): Promise<void> => {
   return getConnection().close();
};
export { databaseDisconnect };
