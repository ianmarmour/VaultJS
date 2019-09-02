const Crypto = require("./crypto");
const DatabaseUtility = require("./database");
let foo = new Crypto();

(async () => {
  try {
    const keyPair = await foo.generateKeyPair({ password: "ianarm" });
    const encryptedFile = await foo.encryptFile({
      inputFilePath: "/home/ian/Pictures/wallhaven-eywdv8.png",
      encryptedFilePath: "/home/ian/Pictures/wallhaven-eywdv8.png.coded",
      key: keyPair.key,
      iv: keyPair.iv
    });
    const db = new DatabaseUtility();
    db.insertCryptoPair({
      fileName: "/home/ian/Pictures/wallhaven-eywdv8.png",
      key: keyPair.key,
      iv: keyPair.iv
    });
    let cryptoPair = await db.getCryptoPair({
      fileName: "/home/ian/Pictures/wallhaven-eywdv8.png"
    });

    const decryptedFile = await foo.decryptFile({
      iv: cryptoPair[0].iv,
      key: cryptoPair[0].key,
      decryptedFilePath: "/home/ian/Pictures/test-fuck.png",
      encryptedFilePath: "/home/ian/Pictures/wallhaven-eywdv8.png.coded"
    });
  } catch (err) {
    console.log(err);
  }
})();
