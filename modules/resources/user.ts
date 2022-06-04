import UserOptions from "./userOptions";

export default class User {

    public id: string;
    public username: string;
    public avatar: string;
    public options: UserOptions;

    constructor(id: string, username: string, avatar: string) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.options = new UserOptions();
    }

    public getAvatarURL(): string {
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
    }

    public getOptions(): UserOptions {
        return this.options;
    }

}