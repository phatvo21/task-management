import { addAlias } from "module-alias";

const registerAlias = (root: string, folders: string[]): void => {
   folders.map((path) => addAlias(path, `${root}/${path}`));
};

export { registerAlias };
