// xx-space-local-dev
function GithubToken(options={}){
  let authorize = "https://github.com/login/oauth/authorize";
  let accessToken = "https://github.com/login/oauth/access_token";
  let client_id = "6d1f0f1a67b21e729050";
  let client_secret = "22cbbe70c70edb70097236f0b8e51c46b8ac460e";
  let proxyUrl = "http://xiongxiao.me:9101/";
  function init(){
    if(options.authorize){
      authorize = options.authorize;
    }
    if(options.accessToken){
      accessToken = options.accessToken;
    }
    if(options.client_id){
      client_id = options.client_id;
    }
    if(options.client_secret){
      client_secret = options.client_secret;
    }
    if(options.proxyUrl){
      proxyUrl = options.proxyUrl
    }
  }
  // 初始化
  init();
  const XSPACE = 'xx-space-';
  const TOKEN = 'token';
  const ACCESS_TOKEN= 'access_token';
  function login() {
    location.href = authorize + "?" + `client_id=${client_id}`;
  }
  function setItem(key, value) {
    localStorage.setItem(XSPACE+key, value);
  }
  function getItem(key) {
    return localStorage.getItem(XSPACE+key);
  }
  function removeItem(key) {
    localStorage.removeItem(XSPACE+key);
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
  // 提交code
  function postCode2() {
    let code = getQueryVariable("code");
    if (code) {
      axios
        .post(proxyUrl + accessToken, { client_id, client_secret, code })
        .then((res) => {
          if (res.status == 200) {
            saveToken(res.data)
          } else {
            console.log(res);
          }
        })
        .catch(console.log);
    }
  }
  function saveToken(accessToken){
    // "access_token=fabc48079ffb6bdb5b0a9dce9bbb8f149af0fb0b&scope=public_repo&token_type=bearer"
    let isAccessToken = /access_token/.test(accessToken)
    if(!isAccessToken){
      alert("登录错误");
      return;
    }
    setItem(ACCESS_TOKEN, accessToken);
    setItem(TOKEN, getQueryVariable('access_token', accessToken));
  }
  function removeToken(){
    removeItem(ACCESS_TOKEN);
    removeItem(TOKEN)
  }
  function getToken(){
    return getItem(TOKEN);
  }
  function postCode() {
    let code = getQueryVariable("code");
    let data = {client_id,client_secret, code};
    if (code) {
      return fetch(proxyUrl + accessToken,{
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        mode: 'cors',
      }).then(res=>{
        return res.text().then(text=>{
          saveToken(text);
          return getToken();
        })
      })
    }
  }
  function isNext(){
    return !!getQueryVariable("code")
  }  
  function hasToken(){
    return !!getToken();
  }
  function auto() {
    if(hasToken()){
      return Promise.resolve(getToken());
    }
    if(isNext()){
      let nt = postCode();
      return nt;
    }else{
      login();
    }
  }
  return {
    login: login,
    isNext: isNext,
    next: postCode,
    getToken: getToken,
    hasToken: hasToken,
    logout: removeToken,
    auto: auto
  }
}
