const ImageKit = require("@imagekit/nodejs")
const client = new ImageKit({
  privateKey: "private_lxq8Wc/2PnxdtbgH5XIaptQgBaE="
});

async function uploadfile(buffer){
    const result = await client.files.upload({
        file : buffer.toString("base64"),
        fileName : "image.jpg"
    })
    return result;
}

module.exports = uploadfile;