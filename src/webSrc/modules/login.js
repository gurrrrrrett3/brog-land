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
Object.defineProperty(exports, "__esModule", { value: true });
class Login {
    static checkIfLoggedIn() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].split("=");
                if (cookie[0] === "session") {
                    //Send a check request
                    fetch("/auth/status", {
                        method: "GET",
                    })
                        .then((res) => res.json())
                        .then((json) => {
                        if (json.success) {
                            //update the navbar
                            let loginButton = document.getElementById("login-button");
                            if (loginButton) {
                                loginButton.hidden = true;
                                //show logged in text
                                let loggedInText = document.getElementById("logged-in");
                                if (loggedInText) {
                                    loggedInText.hidden = false;
                                    loggedInText.innerHTML = `Logged in as <strong>${json.user.username}</strong>`;
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}
exports.default = Login;
