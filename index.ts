import http from 'http';
import https from 'https';
import express from 'express';
import cookieParser from 'cookie-parser';

import fs from 'fs';
import path from 'path';

import authRouter from "./routers/auth";
import imageRouter from "./routers/image";

import SessionManager from './modules/auth/sessionManager';

  const app = express();

  app.use(cookieParser());

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer({
      key: fs.readFileSync('auth/key.pem'),
      cert: fs.readFileSync('auth/cert.pem'),
  })

  //Routes    
  app.use('/auth', authRouter);
  app.use('/image', imageRouter);

  app.use("/public", express.static(path.resolve('./public/')));

  //Auth middleware
  app.use((req, res, next) => {
      if (req.cookies.session) {
        const session = SessionManager.checkSession(req.cookies.session);
        if (session) {
          res.cookie("session", session.session, {
            //1 week
            expires: new Date(session.lastUsed + 1000 * 60 * 60 * 24 * 7),
          });
        } else {
            //session expired or invalid
              res.clearCookie("session");
        }

      } 
      next();
    });

app.get('/', (req, res) => {
    res.sendFile(path.resolve("./public/html/index.html"));
})

app.get("/login", (req, res) => {
    res.redirect("/auth/login");
})

httpServer.listen(8080, () => {
    console.log("HTTP Server running on port 8080");
})

httpsServer.listen(8443, () => {
    console.log("HTTPS Server running on port 8443");
})