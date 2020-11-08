# Github Oauth Login

## 介绍

静态页面，获取 github token,使用 github 的 api。

## 使用方法

```js
// 默认设置
let authorizeUrl = "https://github.com/login/oauth/authorize";
let accessTokenUrl = "https://github.com/login/oauth/access_token";
let client_id = "6d1f0f1a67b21e729050";
let client_secret = "22cbbe70c70edb70097236f0b8e51c46b8ac460e";
let proxyUrl = "http://xiongxiao.me:9101/";

const options = {
  authorizeUrl,
  accessTokenUrl,
  client_id,
  client_secret,
  proxyUrl,
};
GithubToken().auto().then(console.log);
```

## api 接口

### 函数 login

跳转 github 登录界面

### 函数 isNext

判断是否有 code，是否执行下一步

### 函数 next

执行下一步，发送 code，获取 access_token

### 函数 getToken

获取保存的 token

### 函数 hasToken

判断是否拥有 token

### 函数 logout

移除保存的 token

### 函数 auto

自动化操作-自动化流程

- 是否存在 token,存在则返回
- 自动 login，判断是否是下一步，不是就跳转`https://github.com/login/oauth/authorize`获取 code
- 存在 code，则发送 code 获取 access_token
- 得到保存 token，返回 token

## 原理

第一步: Get 请求`https://github.com/login/oauth/authorize`，发送 clinet_id,获取 code

第二步：Post 请求`https://github.com/login/oauth/access_token`,发送 client_id,client_secret,code 获取 access_token

Post 请求，进行设置代理，因为获取 access_token 不能跨域，代理的方法是 cros_anywhere.

## 使用介绍

使用我自己的开发配置;

应用：xx-space-local-dev  
client_id: 6d1f0f1a67b21e729050  
client_secret: 22cbbe70c70edb70097236f0b8e51c46b8ac460e  
callback_url: http://localhost:3000/login_callback  
proxyUrl: "http://message.xiongxiao.me/cors/"  
queryUrl: "http://message.xiongxiao.me/api/gitThinkToken"  

client_id,client_secret,callback_url是配置github应用获取得到的。

proxyUrl是cros_anywhere的地址
queryUrl是自己开发的后端小demo（保护client_secret,当配置中的client_secret不存在，使用服务器上面的)

```html
<body>
<h1>测试cors-where登录github</h1>
<button onclick="login()">登录</button>
<button onclick="postCode()">提交code</button>
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script type="module">
    import GithubToken from "think-space-oauth";
    GithubToken().logout();
    function login() {
    // console.log("login",GithubToken);
    GithubToken().auto().then(console.log);
    }
    function postCode() {
    let a = GithubToken().auto();
    a.then(console.log);
    }
    window.login = login;
    window.postCode = postCode;
</script>
  </body>
```

## 程序介绍

```ts
export interface GithubTokenOptions {
  authorizeUrl?: string;
  accessTokenUrl?: string;
  client_id?: string;
  client_secret?: string;
  proxyUrl?: string;
  queryUrl?: string;
}
export interface GithubTokenValue {
  login: () => any;
  isNext: () => any;
  next: () => any;
  getToken: () => any;
  logout: () => any;
  auto: () => Promise<any>;
}
declare const GithubToken: (
  githubToenOptions?: GithubTokenOptions
) => GithubTokenValue;
```
auto的主要功能是判断当前状态，是否login（第一步），还是next（第二步），根据状态获取数据。logout删除数据

获取到的token放在localStorage当中的。

当client_secret不存在，会请求queryUrl进行后台获取token,后端代码如koa例子；

## 代理请求数据

因为第二步，请求的数据需要代理，因此，使用了 cros_where 的库。我的代理的 url 是：http://message.xiongxiao.me/cors/

github app，个人不喜欢暴露出来，所以我自己的部分，为了获取 token，写了一个小后端，然后可以自己后端处理请求 token。

url:`http://**/gitThinkToken?code=**&client_id=**&client_secret=**`

代码简介在 [koa例子](#koa例子)当中

## 使用think-space-token例子

example当中

## koa例子

运行koa-example代码

code 通过example的例子拿取到code,替换下面链接的`CODE`;或者使用类似请求`https://github.com/login/oauth/authorize?client_id=6d1f0f1a67b21e729050`得到code;

请求url: http://localhost:3001/gitThinkToken?client_id=6d1f0f1a67b21e729050&client_secret=22cbbe70c70edb70097236f0b8e51c46b8ac460e&code=CODE

会返回类似结果：

```
access_token=72a4211d4107a9ad480b3b727db1589dddf541dc&scope=&token_type=bearer
```

```ts
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

```