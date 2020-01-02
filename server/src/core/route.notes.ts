import Router from "koa-router";
import status from "http-status-codes";
import { authMiddleware } from "./middlewares";
import { deleteNote, getNotes, getNote, insertNote } from "./resolvers.notes";
import Application = require("koa");


export default (app: Application) : void => {
    const router = new Router({ prefix: '/api/notes' });

    router.get('/', async ctx => {
        try {
            const notes = await getNotes();
            ctx.status = status.OK;
            ctx.body = {
                notes
            };
        } catch (error) {
            ctx.status = error.status || status.INTERNAL_SERVER_ERROR;
            ctx.body = {
                errors: error.message
            };
        }
    });


    router.post('/', authMiddleware, async ctx => {
       try {
           const { username } = ctx.state.user;
           const note = await insertNote({ ...ctx.request.body, username });
           ctx.status = status.CREATED;
           ctx.body = {
               note
           };
       } catch (error) {
           ctx.status = error.status || status.INTERNAL_SERVER_ERROR;
           ctx.body = {
               errors: error.message
           };
       }
    });

    router.del('/:id', authMiddleware, async ctx => {
        try {
            const { id } = ctx.params;
            const { user } = ctx.state;
            const deleted = await deleteNote(id, user.username);
            ctx.status = status.OK;
            ctx.body = {
                deleted
            };
        } catch (error) {
            ctx.status = error.status || status.INTERNAL_SERVER_ERROR;
            ctx.body = {
                errors: error.message
            };
        }
    });


    router.get('/:id', async ctx => {
        try {
            const { id } = ctx.params;
            const note = await getNote(id);
            ctx.status = status.OK;
            ctx.body = {
              note
            };
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