import { Pool, QueryResult } from "pg";

type User = {
    username: string,
    userId: number
};

interface UserResponse extends WithToken, User {}

type AuthenticatePayload = {
    username: string,
    password: string
};

type CreateUserPayload = {
    username: string,
    password: string
};

type Note = {
    username: string,
    text: string,
    lat: number,
    lng: number,
    noteId: number
};

type PgUser = {
    user_id: number,
    username: string,
    pass_hash: string,
    created_at: string
};

type PgArgs = {
    statement: string,
    params?: any[]
};

type WithToken = {
    token: string
};

type PgNote = {
    noteId: number,
    text: string,
    author: number,
    createdAt: string,
    updatedAt: string,
    deleted: boolean,
    lat: number,
    lng: number,
    deletedAt: string
};

type CreateNoteArgs = {
    text: string,
    author: number,
    username: string,
    lat: number,
    lng: number
};

type EditNoteArgs = {
    id: number,
    text?: string,
    lat?: number,
    lng?: number
};


interface IPostgres {
    readonly  _conn: Pool,
    readonly exec: <R>(args: PgArgs) => Promise<QueryResult<R>>;
}

export {
    PgArgs,
    IPostgres,
    User,
    PgUser,
    Note,
    AuthenticatePayload,
    CreateUserPayload,
    PgNote,
    CreateNoteArgs,
    EditNoteArgs,
    UserResponse,
    WithToken
};