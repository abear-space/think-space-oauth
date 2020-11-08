// xx-space-local-dev
function GithubToken(options = {}) {
  let authorizeUrl = "https://github.com/login/oauth/authorize";
  let accessTokenUrl = "https://github.com/login/oauth/access_token";
  let client_id = "6d1f0f1a67b21e729050";
  let client_secret = "22cbbe70c70edb70097236f0b8e51c46b8ac460e";
  let proxyUrl = "http://message.xiongxiao.me/cors/";
  let queryUrl = "http://message.xiongxiao.me/api/gitThinkToken"
  function init() {
    if (options.authorizeUrl) {
      authorizeUrl = options.authorizeUrl;
    }
    if (options.accessTokenUrl) {
      accessTokenUrl = options.accessTokenUrl;
    }
    if (options.client_id) {
      client_id = options.client_id;
    }
    if (options.client_secret) {
      client_secret = options.client_secret;
    }
    if (options.proxyUrl) {
      proxyUrl = options.proxyUrl;
    }
    if (options.queryUrl) {
      queryUrl = options.queryUrl;
    }
  }
  // 初始化
  init();
  const XSPACE = "xx-space-";
  const TOKEN = "token";
  const ACCESS_TOKEN = "access_token";
  function login() {
    location.href = authorizeUrl + "?" + `client_id=${client_id}`;
  }
  function setItem(key, value) {
    localStorage.setItem(XSPACE + key, value);
  }
  function getItem(key) {
    return localStorage.getItem(XSPACE + key);
  }
  function removeItem(key) {
    localStorage.removeItem(XSPACE + key);
  }
  // 对象获取名字
  function getKeyName(kv) {
    for (let i in kv) {
      return i;
    }
    return false;
  }
  function getQueryVariable(variable, queryUrl) {
    var query = window.location.search.substring(1);
    if (queryUrl != undefined) {
      query = queryUrl;
    }
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }
  function saveToken(accessToken) {
    // 返回token的例子
    // "access_token=fabc48079ffb6bdb5b0a9dce9bbb8f149af0fb0b&scope=public_repo&token_type=bearer"
    let isAccessToken = /access_token/.test(accessToken);
    if (!isAccessToken) {
      alert("登录错误");
      console.error(accessToken);
      removeToken();
      return;
    }
    setItem(ACCESS_TOKEN, accessToken);
    setItem(TOKEN, getQueryVariable("access_token", accessToken));
  }
  function removeToken() {
    removeItem(ACCESS_TOKEN);
    removeItem(TOKEN);
  }
  function getToken() {
    return getItem(TOKEN);
  }
  async function postCode() {
    if(client_secret) {
      return postCodeCors();
    } else {
      return postCodeEnd();
    }
  }
  async function postCodeCors() {
    let code = getQueryVariable("code");
    let data = { client_id, client_secret, code };
    if (code) {
      const res = await fetch(proxyUrl + accessTokenUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        mode: "cors",
      });
      const text = await res.text();
      saveToken(text);
      return getToken();
    }
  }
  // 因为client_secret 使用代理不好，所以优化方法，得到token，后端服务器请求数据
  async function postCodeEnd() {
    let code = getQueryVariable("code");
    let data = { client_id, client_secret, code };
    if (code) {
      const res = await fetch(proxyUrl + accessTokenUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        mode: "cors",
      });
      const text = await res.text();
      saveToken(text);
      return getToken();
    }
  }
  function isNext() {
    return !!getQueryVariable("code");
  }
  function hasToken() {
    return !!getToken();
  }
  function auto() {
    if (hasToken()) {
      return Promise.resolve(getToken());
    }
    if (isNext()) {
      let nt = postCode();
      return nt;
    } else {
      login();
      return Promise.resolve("登录页面");
    }
  }
  return {
    login: login,
    isNext: isNext,
    next: postCode,
    getToken: getToken,
    hasToken: hasToken,
    logout: removeToken,
    auto: auto,
  };
}
export { GithubToken };

export default GithubToken;
