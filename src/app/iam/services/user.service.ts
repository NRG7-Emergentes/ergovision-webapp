import { Injectable } from '@angular/core';
import { BaseService } from "@shared/services/base.service";
import { HttpClient } from '@angular/common/http';
import { User } from '../domain/model/user.entity';
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User>{
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/users';
  }
}
