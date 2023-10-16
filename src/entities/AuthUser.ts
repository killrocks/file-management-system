export interface IAuthUser {
    _id: string;
    username: string;
    password: string;
}

export interface IServerAuthUser extends IAuthUser, Document {
    id: string;
}
