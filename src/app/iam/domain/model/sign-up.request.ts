export class SignUpRequest {
  public username: string;
  public password: string;
  public roles: string[] = [];

  constructor(username: string, password: string, roles: string[]) {
    this.password = password;
    this.username = username;
    this.roles = roles;
  }
}
