import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authToken = localStorage.getItem('token');
  const handledRequest = authToken
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${authToken}`)} )
    : req;
  return next(handledRequest);
}
