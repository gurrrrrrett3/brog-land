import path from "path";
import fs from "fs";
import SessionManager from "../auth/sessionManager";

export interface ImageMeta {
  id: string;
  type: string;
  name: string;
  owner: string;
  uploaded: number;
  tags: string[];
}

export default class ImageManager {
  public static readonly IMAGE_TEMP_PATH: string = path.resolve("./data/images/temp") + "/";

  public static saveImage(
    fileName: string,
    fileType: string,
    name: string,
    tags: string,
    session: string | undefined
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      //check session
      if (session) {
        const sessionData = SessionManager.checkSession(session);
        if (!sessionData) {
          return reject({
            status: 401,
            message: "You need to be logged in to upload an image.",
          });
        }

        //save image
        const imagePath = path.resolve(
          "./data/images/storage/" + fileName + "." + fileType.replace("image/", "")
        );
        const tempPath = path.resolve("./data/images/temp/" + fileName);
        fs.rename(tempPath, imagePath, (err) => {
          if (err) {
            return reject({
              status: 500,
              message: "Error while saving image.",
            });
          }

          //save image data

          const imageData: ImageMeta = {
            id: fileName,
            type: fileType.replace("image/", ""),
            name: name,
            owner: sessionData.user,
            uploaded: Date.now(),
            tags: tags.split(",").map((t) => t.trim()),
          };

          fs.writeFile(
            path.resolve("./data/images/meta/" + fileName + ".json"),
            JSON.stringify(imageData),
            (err) => {
              if (err) {
                return reject({
                  status: 500,
                  message: "Error while saving image data.",
                });
              }
            }
          );

          return resolve(fileName);
        });
      }
    });
  }
}
