import { Next, Context } from "koa";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import status from "http-status-codes";

const secret : string = process.env.SECRET;

async function authMiddleware(ctx: Context, next: Next) : Promise<void> {
    let { auth = null } = ctx.query;
    if (!auth && ctx.request.headers['authorization']) {
        const [type, token] = ctx.request.headers['authorization'].split(' ');
        if (type === 'Bearer') {
            auth = token;
        }
    }
    if (auth) {
        try {
            ctx.state.user = await jwt.verify(auth, secret);
            // if need to pass jwt next
            ctx.state.token = auth;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                ctx.status = status.UNAUTHORIZED;
                ctx.body = {
                  error: 'Authorization token expired'
                };
                return ;
            }

            if (error instanceof JsonWebTokenError) {
                ctx.status = status.UNAUTHORIZED;
                ctx.body = {
                    error: 'Invalid authorization token'
                };
                return ;
            }
            throw error;
        }
    }

    if (!ctx.state.user || !ctx.state.token) {
        ctx.status = status.UNAUTHORIZED;
        ctx.body = {
            error: 'Authorization token is required'
        };
        return ;
    }
    return next();
}

export { authMiddleware };