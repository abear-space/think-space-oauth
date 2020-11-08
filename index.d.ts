export interface GithubTokenOptions {
  authorizeUrl?: string;
  accessTokenUrl?: string;
  client_id?: string;
  client_secret?: string;
  proxyUrl?: string;
  queryUrl?: string;
  useQueryUrl?: boolean;
}
export interface GithubTokenValue {
  login: () => any;
  isNext: () => any;
  next: () => any;
  getToken: () => any;
  logout: () => any;
  auto: () => Promise<any>;
}
declare const GithubToken:  (githubToenOptions?: GithubTokenOptions) => GithubTokenValue;