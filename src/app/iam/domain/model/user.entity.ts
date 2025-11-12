export class User {
  id:number;
  username: string;
  roles: string[];
  name: string;
  lastName: string;
  age: number;
  height: number;
  weight: number;
  imageUrl: string;

  constructor(){
    this.id = 0;
    this.username = '';
    this.roles = [];
    this.name = '';
    this.lastName = '';
    this.age = 0;
    this.height = 0;
    this.weight = 0;
    this.imageUrl = '';
  }
}
