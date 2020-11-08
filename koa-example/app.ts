import Koa from "koa";
import Cors from "koa-cors";
import Router from "koa-router";
import got from "got";

const app = new Koa();

const router = new Router();

router.get("/gitThinkToken", async (ctx: any) => {
  const query = ctx.query;
  const client_id = query.client_id;
  const code = query.code;
  let client_secret = query.client_secret;
  const url = query.url ?? "https://github.com/login/oauth/access_token";
  const searchParams: any = new URLSearchParams([
    ["client_id", client_id],
    ["client_secret", client_secret],
    ["code", code],
  ]);
  const { body } = await got(url, {
    searchParams,
  });
  ctx.body = body;
});

app.use(Cors());

app.use(router.routes());

const port = 3001;
app.listen(port, () => {
  console.log("server is running on", port);
});
