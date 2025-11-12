export class SignUpResponse {
  public id: number;
  public username: string;
  public name: string;
  public lastName: string;
  public age: number;
  public height: number;
  public weight: number
  public imageUrl: string;

  constructor(id: number, username: string, name: string, lastName: string, age: number, height: number, weight: number, imageUrl: string) {
    this.username = username;
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.imageUrl = imageUrl;
  }
}
