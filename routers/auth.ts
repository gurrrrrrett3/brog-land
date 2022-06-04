import { Router } from "express";
import path from "path";
import StateManager from "../modules/auth/stateManager";
import UserManager from "../modules/auth/userManager";
import SessionManager from "../modules/auth/sessionManager";
import Util from "../modules/auth/authUtil";
import auth from "../auth/auth.json";
const router = Router();

router.get("/login", (req, res) => {
  res.redirect(Util.buildDiscordAuthURL(auth.CLIENT_ID, auth.REDIRECT_URI, auth.SCOPE));
});

router.get("/callback", (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code || !state) {
    res.send("Error: No code or state");
    return;
  }

  if (StateManager.checkState(state.toString())) {
    UserManager.authUser(code.toString())
      .then((user) => {
        res.cookie("session", SessionManager.genSession(user.id).session).redirect("/");
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.send(
      "Error: Invalid state, you may have been redirected here by a third party site. Please try again."
    );
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});

router.get("/check", (req, res) => {
  const to = req.query.to;
  if (!to) {
    res.status(400).sendFile(path.resolve("./public/html/errors/400.html"));
    return;
  }
  if (req.cookies.session) {
    const session = SessionManager.checkSession(req.cookies.session);
    if (session) {
      res.cookie("session", session.session).redirect(to.toString());
    } else {
      res.status(401).redirect("/login");
    }
  } else {
    res.status(401).redirect("/login");
  }
});

router.get("/status", (req, res) => {
  if (req.cookies.session) {
    const session = SessionManager.checkSession(req.cookies.session);
    if (session) {
      res
        .cookie("session", session.session, {
          expires: new Date(session.lastUsed + 1000 * 60 * 60 * 24 * 7),
        })
        .send({
          success: true,
          status: "logged in",
          user: UserManager.getUser(session.user),
        });
    } else {
      res.send({
        success: false,
        status: "not logged in",
      });
    }
  }
});

export default router;
