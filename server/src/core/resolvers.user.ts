import bCrypt from "bcrypt";
import status from "http-status-codes";
import { postgres } from "./postgres";
import jwt from "jsonwebtoken";
import { User, AuthenticatePayload, CreateUserPayload, PgUser, UserResponse } from "./typings";

async function _getUser(username: string) : Promise<PgUser> {
    const { rows } = await postgres.exec<PgUser>({
        statement: `
            select * from users where username = $1::varchar limit 1;
        `,
        params: [ username ]
    });
    return rows && rows[0];
}

async function exists(id?: number, username?: string) : Promise<boolean> {
    const { rows: [v] } = await postgres.exec<{count: string}>({
        statement: `
            select count(*) as "count" from users
            where user_id = $1::integer or username=$2::varchar
            limit 1;
        `,
        params: [ id, username ]
    });
    return !!(v && v.count && parseInt(v.count) > 0);
}

async function createUser(args: CreateUserPayload) : Promise<UserResponse> {
    if (await exists(undefined, args.username)) {
        const error : any = new Error(`User with username ${args.username} exists in DB.`);
        error.status = status.BAD_REQUEST;
        throw error;
    } else {
        const hash = await bCrypt.hash(args.password, 10);
        const {rows: [user], rowCount} = await postgres.exec<User>({
            statement: `
                insert into users (username, pass_hash) values ($1::varchar, $2::varchar)
                returning username, user_id as "userId";
            `,
            params: [args.username, hash]
        });
        if (!rowCount) throw new Error(`Something went wrong, try again.`);
        const token = await jwt.sign(user, process.env.SECRET);
        return {
            ...user,
            token
        };
    }
}

async function authenticate(args: AuthenticatePayload) : Promise<UserResponse> {
    if (!await exists(undefined, args.username)) {
        const error : any = new Error(`User with username ${args.username} not exists in DB.`);
        error.status = status.NOT_FOUND;
        throw error;
    } else {
        const { pass_hash: passHash, user_id: userId, username } = await _getUser(args.username);
        const isMatch = await bCrypt.compare(args.password, passHash);
        if (!isMatch) {
            const error : any = new Error(`Passwords do not match.`);
            error.status = status.UNAUTHORIZED;
            throw error;
        }
        const user = { userId, username };
        const token = await jwt.sign(user, process.env.SECRET);
        return {
            ...user,
            token
        };
    }
}


export {
    createUser,
    authenticate
};