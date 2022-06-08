"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userOptions_1 = __importDefault(require("./userOptions"));
class User {
    constructor(id, username, avatar) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.options = new userOptions_1.default();
    }
    getAvatarURL() {
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
    }
    getOptions() {
        return this.options;
    }
}
exports.default = User;
