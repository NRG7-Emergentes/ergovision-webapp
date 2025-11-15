export class SignInResponse {
  public id: number;
  public username: string;
  public imageUrl: string;
  public token: string;
  public roles: string[];
  constructor(id: number, username: string,imageUrl : string, token: string, roles: string[]) {
    this.id = id;
    this.username = username;
    this.imageUrl = imageUrl;
    this.token = token;
    this.roles = roles;
  }
}
