import { Injectable } from '@angular/core';
import { BaseService } from "@shared/services/base.service";
import { HttpClient } from '@angular/common/http';
import { User } from '../domain/model/user.entity';
import { Observable} from 'rxjs';
import {UpdateUserRequest} from '@app/iam/domain/model/update-user.request';
import {SignUpResponse} from '@app/iam/domain/model/sign-up.response';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User>{
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/users';
  }

  getUserMe(): Observable<User> {
    return this.http.get<User>(`${this.basePath}${this.resourceEndpoint}/me`);
  }

  updateProfile(userData: UpdateUserRequest): Observable<SignUpResponse> {
    return this.http.put<SignUpResponse>(`${this.basePath}${this.resourceEndpoint}`, userData);
  }

}
