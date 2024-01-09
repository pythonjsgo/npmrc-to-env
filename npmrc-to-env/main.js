import { program } from 'commander';
import { processDirectory } from './npmrc-to-env.js';
import {listModules, removeKey, replaceKey} from "./package-analyzer.js"; // Импортируйте функцию из модифицированного модуля
import { compareDependencies } from './compare-dependencies.js';
program
    .command('parse-npmrc [directory]')
    .description('Сбор данных из файлов .npmrc')
    .action((directory) => {
        processDirectory(directory).catch(console.error);
    });
program
    .command('list-modules [path]')
    .description('Показать список всех подпроектов и модулей из package.json')
    .action((path) => {
        listModules(path).catch(console.error);
    });


program
    .command('remove-key <pathToPackageJson> <key>')
    .description('Удалить ключ из package.json')
    .action((path, key) => {
        removeKey(path, key).catch(console.error);
    });

program
    .command('replace-key <pathToPackageJson> <key> <newValue>')
    .description('Заменить значение ключа в package.json')
    .action((path, key, newValue) => {
        replaceKey(path, key, newValue).catch(console.error);
    });


program
    .command('compare-deps <rootDirectory>')
    .description('Сканировать все package.json в папке и подпапках')
    .action((rootDirectory) => {
        compareDependencies(rootDirectory).catch(console.error);
    });


program.parse(process.argv);


