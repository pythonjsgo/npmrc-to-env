import fs from 'fs/promises';
import path from 'path';

const readPackageJson = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Ошибка при чтении файла: ${filePath}`, error);
        return null;
    }
};

const scanDirectories = async (directory, callback) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules') continue;

            await scanDirectories(fullPath, callback);
        } else if (entry.isFile() && entry.name === 'package.json') {
            const packageJson = await readPackageJson(fullPath);
            if (packageJson) callback(packageJson, fullPath);
        }
    }
};



export const compareDependencies = async (rootDirectory) => {
    const allDependencies = {};

    await scanDirectories(rootDirectory, (packageJson, filePath) => {
        for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
            if (packageJson[key]) {
                for (const [dependency, version] of Object.entries(packageJson[key])) {
                    if (!allDependencies[dependency]) {
                        allDependencies[dependency] = new Set();
                    }
                    allDependencies[dependency].add(version);
                }
            }
        }
    });

    // Вывод результата
    for (const [dependency, versions] of Object.entries(allDependencies)) {
        if (versions.size > 1) {
            console.log(`${dependency}: разные версии - ${Array.from(versions).join(', ')}`);
        } else {
            console.log(`${dependency}: единая версия - ${Array.from(versions).join(', ')}`);
        }
    }
};
