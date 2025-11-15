export class SignUpResponse {

  id: number;
  username: string;
  email: string;
  imageUrl: string;
  age: number;
  height: number;
  weight: number;
  roles: string[];

  constructor(
    id: number,
    username: string,
    email: string,
    imageUrl: string,
    age: number,
    height: number,
    weight: number,
    roles: string[]) {

    this.id = id;
    this.username = username;
    this.email = email;
    this.imageUrl = imageUrl;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.roles = roles;
  }

}
