"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const imageManager_1 = __importDefault(require("../modules/images/imageManager"));
const upload = (0, multer_1.default)({ dest: path_1.default.resolve("./data/images/temp") });
const router = (0, express_1.Router)();
router.get("/upload", (req, res) => {
    res.sendFile(path_1.default.resolve("./public/html/upload/index.html"));
});
//Image management
router.post("/upload", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let image = req.file;
    if (!image) {
        res.status(400).sendFile(path_1.default.resolve("./public/html/errors/400.html"));
        return;
    }
    let name = req.body.name;
    let tags = req.body.tags;
    let fileName = yield imageManager_1.default.saveImage(image.filename, image.mimetype, name, tags, req.cookies.session).catch(err => {
        res.status(err.status).send(err.message);
        return;
    });
    res.redirect("/image/view/" + fileName);
}));
exports.default = router;
