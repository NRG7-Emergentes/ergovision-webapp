export class SignUpRequest {
  public username: string;
  public password: string;
  public roles: string[] = [];
  public name: string;
  public lastName: string;
  public age?: number;
  public height?: number;
  public weight?: number;
  public imageUrl?: string;

  constructor(
    username: string,
    password: string,
    roles: string[],
    name: string,
    lastName: string,
    age?: number,
    height?: number,
    weight?: number,
    imageUrl?: string
  ) {
    this.username = username;
    this.password = password;
    this.roles = roles;
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.imageUrl = imageUrl;
  }
}
