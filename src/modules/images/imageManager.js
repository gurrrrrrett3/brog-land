"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sessionManager_1 = __importDefault(require("../auth/sessionManager"));
class ImageManager {
    static saveImage(fileName, fileType, name, tags, session) {
        return new Promise((resolve, reject) => {
            //check session
            if (session) {
                const sessionData = sessionManager_1.default.checkSession(session);
                if (!sessionData) {
                    return reject({
                        status: 401,
                        message: "You need to be logged in to upload an image.",
                    });
                }
                //save image
                const imagePath = path_1.default.resolve("./data/images/storage/" + fileName + "." + fileType.replace("image/", ""));
                const tempPath = path_1.default.resolve("./data/images/temp/" + fileName);
                fs_1.default.rename(tempPath, imagePath, (err) => {
                    if (err) {
                        return reject({
                            status: 500,
                            message: "Error while saving image.",
                        });
                    }
                    //save image data
                    const imageData = {
                        id: fileName,
                        type: fileType.replace("image/", ""),
                        name: name,
                        owner: sessionData.user,
                        uploaded: Date.now(),
                        tags: tags.split(",").map((t) => t.trim()),
                    };
                    fs_1.default.writeFile(path_1.default.resolve("./data/images/meta/" + fileName + ".json"), JSON.stringify(imageData), (err) => {
                        if (err) {
                            return reject({
                                status: 500,
                                message: "Error while saving image data.",
                            });
                        }
                    });
                    return resolve(fileName);
                });
            }
        });
    }
}
exports.default = ImageManager;
ImageManager.IMAGE_TEMP_PATH = path_1.default.resolve("./data/images/temp") + "/";
