export interface GithubTokenOptions {
  authorizeUrl: string;
  accessTokenUrl: string;
  client_id: string;
  client_secret: string;
  proxyUrl: string;
}

export interface GitHubToken {
  login: any;
  isNext: any;
  next: any;
  getToken: any;
  logout: any;
  auto: Promise<any>;
}