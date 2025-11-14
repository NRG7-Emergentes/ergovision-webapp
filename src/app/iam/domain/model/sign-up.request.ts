export class SignUpRequest {
  username: string;
  email: string;
  imageUrl: string;
  age: number;
  height: number;
  weight: number;
  roles: string[];

  constructor(
    username: string,
    email: string,
    imageUrl: string,
    age: number,
    height: number,
    weight: number,
    roles: string[]) {
    this.username = username;
    this.email = email;
    this.imageUrl = imageUrl;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.roles = roles;
  }

}
