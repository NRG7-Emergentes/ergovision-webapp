import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Only add auth header for API requests
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const rawToken = localStorage.getItem('token');

  if (!rawToken) {
    console.warn('[Auth Interceptor] No token found for request:', req.url);
    return next(req);
  }

  // Strip quotes if present
  const token = rawToken.replace(/^["']|["']$/g, '').trim();

  if (!token) {
    console.warn('[Auth Interceptor] Token is empty after cleaning');
    return next(req);
  }

  const handledRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('[Auth Interceptor] Added token to request:', req.url);

  return next(handledRequest);
};
