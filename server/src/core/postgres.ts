import { Pool, PoolConfig, QueryResult } from "pg";
import { PgArgs, IPostgres } from "./typings";

const {
    POSTGRES_HOST: host,
    POSTGRES_PORT: port,
    POSTGRES_USER: user,
    POSTGRES_PASSWORD: password,
    POSTGRES_NAME: database
} = process.env;


class Postgres implements IPostgres {
    _conn: Pool;
    constructor(opts: PoolConfig) {
        this._conn = new Pool(opts);
    }

    exec<T>(args: PgArgs) : Promise<QueryResult<T>> {
        return this._conn.query(args.statement, args.params);
    }
}


export const postgres = new Postgres({ port: parseInt(port), host, user, password, database });