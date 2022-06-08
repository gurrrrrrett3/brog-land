"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const stateManager_1 = __importDefault(require("../modules/auth/stateManager"));
const userManager_1 = __importDefault(require("../modules/auth/userManager"));
const sessionManager_1 = __importDefault(require("../modules/auth/sessionManager"));
const authUtil_1 = __importDefault(require("../modules/auth/authUtil"));
const auth_json_1 = __importDefault(require("../auth/auth.json"));
const router = (0, express_1.Router)();
router.get("/login", (req, res) => {
    res.redirect(authUtil_1.default.buildDiscordAuthURL(auth_json_1.default.CLIENT_ID, auth_json_1.default.REDIRECT_URI, auth_json_1.default.SCOPE));
});
router.get("/callback", (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    if (!code || !state) {
        res.send("Error: No code or state");
        return;
    }
    if (stateManager_1.default.checkState(state.toString())) {
        userManager_1.default.authUser(code.toString())
            .then((user) => {
            res.cookie("session", sessionManager_1.default.genSession(user.id).session).redirect("/");
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    else {
        res.send("Error: Invalid state, you may have been redirected here by a third party site. Please try again.");
    }
});
router.get("/logout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
});
router.get("/check", (req, res) => {
    const to = req.query.to;
    if (!to) {
        res.status(400).sendFile(path_1.default.resolve("./public/html/errors/400.html"));
        return;
    }
    if (req.cookies.session) {
        const session = sessionManager_1.default.checkSession(req.cookies.session);
        if (session) {
            res.cookie("session", session.session).redirect(to.toString());
        }
        else {
            res.status(401).redirect("/login");
        }
    }
    else {
        res.status(401).redirect("/login");
    }
});
router.get("/status", (req, res) => {
    if (req.cookies.session) {
        const session = sessionManager_1.default.checkSession(req.cookies.session);
        if (session) {
            res
                .cookie("session", session.session, {
                expires: new Date(session.lastUsed + 1000 * 60 * 60 * 24 * 7),
            })
                .send({
                success: true,
                status: "logged in",
                user: userManager_1.default.getUser(session.user),
            });
        }
        else {
            res.send({
                success: false,
                status: "not logged in",
            });
        }
    }
});
exports.default = router;
