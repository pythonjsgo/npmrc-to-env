import fs from 'fs/promises';

export const listModules = async (pathToPackageJson = './package.json') => {
    const packageJson = await readPackageJson(pathToPackageJson);
    const keysOfInterest = ['dependencies', 'devDependencies', 'peerDependencies'];

    keysOfInterest.forEach((key) => {
        if (packageJson[key]) {
            console.log(`\n${key}:`);
            Object.entries(packageJson[key]).forEach(([dependency, version]) => {
                console.log(`- ${dependency}: ${version}`);
            });
        }
    });
};


export const removeKey = async (pathToPackageJson, key) => {
    const packageJson = await readPackageJson(pathToPackageJson);
    delete packageJson[key];
    await writePackageJson(pathToPackageJson, packageJson);
    console.log(`Ключ '${key}' удален из package.json.`);
};


export const replaceKey = async (pathToPackageJson, key, newValue) => {
    const packageJson = await readPackageJson(pathToPackageJson);
    packageJson[key] = newValue;
    await writePackageJson(pathToPackageJson, packageJson);
    console.log(`Ключ '${key}' заменен на '${newValue}' в package.json.`);
};

const readPackageJson = async (path) => {
    const data = await fs.readFile(path, 'utf8');
    return JSON.parse(data);
};

const writePackageJson = async (path, data) => {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
};