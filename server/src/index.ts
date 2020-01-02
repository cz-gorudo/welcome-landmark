import Koa from "koa";
import koaLogger from "koa-logger";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import cors from "koa__cors";
import http from "http";

const app = new Koa();

app.use(koaLogger());
app.use(bodyParser());
app.use(cors());
app.use(helmet());

(async function () {
    require('./core/route.users').default(app);
    require('./core/route.notes').default(app);

    const httpServer = http.createServer(app.callback());

    await new Promise((resolve, reject) => {
        try {
            httpServer.listen(process.env.PORT, () => {
                console.info(`Server started at ${process.env.PORT}`);
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
})();