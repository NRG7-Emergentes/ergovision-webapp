export class SignInResponse {
  public id: number;
  public username: string;
  public token: string;
  public roles: string[];

  constructor(id: number, username: string, token: string, roles: string[]) {
    this.token = token;
    this.username = username;
    this.id = id;
    this.roles = roles;
  }
}
