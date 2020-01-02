declare namespace NodeJS {
    export interface ProcessEnv {
        SECRET: string,
        POSTGRES_HOST: string,
        POSTGRES_PORT: string,
        POSTGRES_USER: string,
        POSTGRES_PASSWORD: string,
        POSTGRES_NAME: string
    }
}