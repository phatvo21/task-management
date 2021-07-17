import {addAlias} from 'module-alias';

const registerAlias = (root: string, folders: string[]): void => {
  folders.map((path) => addAlias(path, `${root}/${path}`));
};

export default registerAlias(__dirname, [
  'services',
  'utils',
  'databases',
  'repositories',
  'components',
  'helpers',
  'middlewares',
  'logging',
  'consoles',
  'constants',
]);
