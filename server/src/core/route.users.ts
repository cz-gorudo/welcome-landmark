import Router from "koa-router";
import { createUser, authenticate } from "./resolvers.user";
import {CreateUserPayload, AuthenticatePayload} from "./typings";
import status from "http-status-codes";
import Application = require("koa");


export default (app: Application) : void => {
    const router = new Router({ prefix: '/api/users' });

    router.post('/authenticate', async ctx => {
        try {
            const response = await authenticate(<AuthenticatePayload>ctx.request.body);
            ctx.status = status.OK;
            ctx.body = response;
        } catch (error) {
            ctx.status = error.status || status.INTERNAL_SERVER_ERROR;
            ctx.body = {
                errors: error.message
            };
        }
    });

    router.post('/sign-up', async ctx => {
        try {
            const response = await createUser(<CreateUserPayload>ctx.request.body);
            ctx.status = status.CREATED;
            ctx.body = response;
        } catch (error) {
            ctx.status = error.status || status.INTERNAL_SERVER_ERROR;
            ctx.body = {
                errors: error.message
            };
        }
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
};