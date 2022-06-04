export default class UserOptions {

    public options: Map<string, (boolean|number|string)>

    constructor() {
        this.options = new Map<string, (boolean|number|string)>();

        //Default options

        //Global options
        this.options.set("accentColor", "#00bcd4");

        //Website
        this.options.set("darkMode", true);
        this.options.set("showSidebar", true);

    }

    public get(key: string): (boolean|number|string) | undefined {
        return this.options.get(key);
    }

    public set(key: string, value: (boolean|number|string)): void {
        this.options.set(key, value);
    }

    public delete(key: string): void {
        this.options.delete(key);
    }

    public has(key: string): boolean {
        return this.options.has(key);
    }

    public getAll(): Map<string, (boolean|number|string)> {
        return this.options;
    }

    public setAll(options: Map<string, (boolean|number|string)>): void {
        this.options = options;
    }

    public getAllAsObject(): object {
        const obj: {[key: string]: (boolean|number|string)} = {};
        this.options.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
}


