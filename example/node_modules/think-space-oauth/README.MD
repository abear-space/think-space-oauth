# Github Oauth Login

## 介绍

静态页面，获取github token,使用github的api。

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
}
GithubToken().auto().then(console.log);
```

## api接口

### 函数login

跳转github登录界面

### 函数isNext

判断是否有code，是否执行下一步

### 函数next

执行下一步，发送code，获取access_token

### 函数getToken

获取保存的token

### 函数hasToken

判断是否拥有token

### 函数logout

移除保存的token

### 函数auto

自动化操作-自动化流程

- 是否存在token,存在则返回
- 自动login，判断是否是下一步，不是就跳转`https://github.com/login/oauth/authorize`获取code
- 存在code，则发送code获取access_token
- 得到保存token，返回token
  
## 原理

Get请求`https://github.com/login/oauth/authorize`，发送clinet_id,获取code

Post请求`https://github.com/login/oauth/access_token`,发送client_id,client_secret,code获取access_token

Post请求，进行设置代理，因为获取access_token不能跨域，代理的方法是cross_anywhere.

## 测试方法

在