const fs = require('fs');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    if (!fs.existsSync(folder)) {
      fs.mkdir(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const fName = +new Date() + meta.fName;
    const path = `${this._folder}/${fName}`;
    const fStream = fs.createWriteStream(path);
    return new Promise((resolve, reject) => {
      fStream.on('error', (error) => reject(error));
      file.pipe(fStream);
      file.on('end', () => resolve(fName));
    });
  }

  deleteFile(fName) {
    const path = `${this._folder}/${fName}`;
    return fs.promises.unlink(path);
  }
}
module.exports = StorageService;
