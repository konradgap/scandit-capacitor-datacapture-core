const fs = require('fs');
const { readdir } = require('fs').promises;
const path = require('path');

const cwd = process.cwd();

const esmFolder = 'dist/esm/';
const pluginTSFolder = `${esmFolder}ts/`;

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

const getTypeDefinitionFileContents = f => {
  return fs.readFileSync(f).toString()
      .replace(/^import.*;$/gm, '')
      .replace(/\s?declare/gm, '')
      .replace(/\s(extends|implements)\s(Default|String)?Serializeable/gm, '')
      .replace(/^export\s{};\s$/gm, '')
      .replace(/^export\s(?=(class|interface) Private)/gm, '')
      .replace(/type [a-zA-z]* = any;/gm, '')
      .replace(/\n+/gm, '\n');
};

getFiles(path.join(cwd, pluginTSFolder))
    .then(files => {
      const typeDefinitionFiles = Array.from(
          files.filter(fileName => fileName.endsWith('.d.ts'))
      );

      fs.appendFileSync(path.join(cwd, esmFolder, 'definitions.d.ts'),
          `
export const ScanditCaptureCorePlugin: ScanditCaptureCorePluginInterface;
declare module Scandit {\n${typeDefinitionFiles.map(getTypeDefinitionFileContents).join('\n')}\n}\n
`
      );

      typeDefinitionFiles.forEach(f => fs.unlinkSync(f))
    })
    .catch(e => console.error(e));
