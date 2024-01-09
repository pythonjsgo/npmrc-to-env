import fs from 'fs/promises';
import path from 'path';

export const processDirectory = async (directory = './') => {
    try {
        const filesAndDirectories = await fs.readdir(directory, { withFileTypes: true });

        for (const dirent of filesAndDirectories) {
            const fullPath = path.join(directory, dirent.name);

            if (dirent.isDirectory()) {
                await processDirectory(fullPath);
            } else if (dirent.name === '.npmrc') {
                await processNpmrcFile(fullPath);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const processNpmrcFile = async (filePath) => {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const envContent = await readEnvFile();
        const lines = content.split('\n');

        for (const line of lines) {
            if (line && line.includes('=')) {
                const [property, value] = line.split('=');
                const envLine = `${property.trim()}=${value.trim()}`;
                if (!envContent.includes(envLine)) {
                    await fs.appendFile('.env', `${envLine}\n`);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const readEnvFile = async () => {
    try {
        const content = await fs.readFile('.env', 'utf-8');
        return content.split('\n');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile('.env', '');
            return [];
        } else {
            throw error;
        }
    }
};


