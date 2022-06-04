import path from "path";
import { application, Router } from 'express';
import multer from 'multer';
import ImageManager from '../modules/images/imageManager';

const upload = multer({ dest: path.resolve("./data/images/temp")});

const router = Router();

router.get("/upload", (req, res) => {
    res.sendFile(path.resolve("./public/html/upload/index.html"));
})

//Image management

router.post("/upload", upload.single("image"), async (req, res) => {
    let image = req.file;
    if (!image) {
        res.status(400).sendFile(path.resolve("./public/html/errors/400.html"));
        return;
    }

    let name = req.body.name;
    let tags = req.body.tags;

   let fileName = await ImageManager.saveImage(image.filename, image.mimetype, name, tags, req.cookies.session).catch(err => {
        res.status(err.status).send(err.message);
        return;
    }   
    )

   res.redirect("/image/view/" + fileName);
})


export default router;