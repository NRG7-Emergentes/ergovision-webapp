export class UpdateUserRequest {
  email: string;
  imageUrl: string;
  age: number;
  height: number;
  weight: number;

  constructor(email: string, imageUrl: string, age: number, height: number, weight: number) {
    this.email = email;
    this.imageUrl = imageUrl;
    this.age = age;
    this.height = height;
    this.weight = weight;
  }



}
