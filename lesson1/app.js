const fs = require('fs/promises');
const path = require('path');


const  sorter = async (readFolder, writeFolder, gender) => {
    const folderPath = path.join(__dirname, readFolder);

    const files = await fs.readdir(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const data = await fs.readFile(filePath);
        const user = JSON.parse(data);

        if (user.gender === gender) {
            await fs.rename(filePath, path.join(__dirname, writeFolder, file));
        }
    }
}

sorter('boys', 'girls', 'female');
sorter('girls', 'boys', 'male');