"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserOptions {
    constructor() {
        this.options = new Map();
        //Default options
        //Global options
        this.options.set("accentColor", "#00bcd4");
        //Website
        this.options.set("darkMode", true);
        this.options.set("showSidebar", true);
    }
    get(key) {
        return this.options.get(key);
    }
    set(key, value) {
        this.options.set(key, value);
    }
    delete(key) {
        this.options.delete(key);
    }
    has(key) {
        return this.options.has(key);
    }
    getAll() {
        return this.options;
    }
    setAll(options) {
        this.options = options;
    }
    getAllAsObject() {
        const obj = {};
        this.options.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
}
exports.default = UserOptions;
