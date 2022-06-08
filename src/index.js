"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routers/auth"));
const image_1 = __importDefault(require("./routers/image"));
const sessionManager_1 = __importDefault(require("./modules/auth/sessionManager"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const httpServer = http_1.default.createServer(app);
const httpsServer = https_1.default.createServer({
    key: fs_1.default.readFileSync('auth/key.pem'),
    cert: fs_1.default.readFileSync('auth/cert.pem'),
});
//Routes    
app.use('/auth', auth_1.default);
app.use('/image', image_1.default);
app.use("/public", express_1.default.static(path_1.default.resolve('./public/')));
//Auth middleware
app.use((req, res, next) => {
    if (req.cookies.session) {
        const session = sessionManager_1.default.checkSession(req.cookies.session);
        if (session) {
            res.cookie("session", session.session, {
                //1 week
                expires: new Date(session.lastUsed + 1000 * 60 * 60 * 24 * 7),
            });
        }
        else {
            //session expired or invalid
            res.clearCookie("session");
        }
    }
    next();
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve("./public/html/index.html"));
});
app.get("/login", (req, res) => {
    res.redirect("/auth/login");
});
httpServer.listen(8080, () => {
    console.log("HTTP Server running on port 8080");
});
httpsServer.listen(8443, () => {
    console.log("HTTPS Server running on port 8443");
});
