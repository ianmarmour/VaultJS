const fs = require("fs");
const crypto = require("crypto");

class Crypto {
  constructor() {
    this.algorithm = "aes-256-cbc";
  }

  async decryptFile({ encryptedFilePath, decryptedFilePath, key, iv }) {
    return new Promise(async (resolve, reject) => {
      key = Buffer.from(key, "hex");
      iv = Buffer.from(iv, "hex");
      let cipher = crypto.createDecipheriv(this.algorithm, key, iv);

      const read = await fs
        .createReadStream(encryptedFilePath)
        .pipe(cipher)
        .pipe(fs.createWriteStream(decryptedFilePath))
        .on("close", () => {
          fs.unlinkSync(encryptedFilePath);
          resolve(true);
        });
    });
  }

  async generateKeyPair({ password }) {
    let key = Buffer.alloc(32);
    let iv = Buffer.alloc(16);

    key = Buffer.concat([Buffer.from(password)], key.length);
    iv = Buffer.from(
      Array.prototype.map.call(iv, () => {
        return Math.floor(Math.random() * 256);
      })
    );

    return { key: key.toString("hex"), iv: iv.toString("hex") };
  }

  async storeKeyPair({ key, iv }) {}

  async encryptFile({ inputFilePath, encryptedFilePath, key, iv }) {
    return new Promise(async (resolve, reject) => {
      key = Buffer.from(key, "hex");
      iv = Buffer.from(iv, "hex");
      let cipher = crypto.createCipheriv(this.algorithm, key, iv);

      fs.createReadStream(inputFilePath)
        .pipe(cipher)
        .pipe(fs.createWriteStream(encryptedFilePath))
        .on("close", () => {
          fs.unlinkSync(inputFilePath);
          resolve(true);
        });
    });
  }
}

module.exports = Crypto;
