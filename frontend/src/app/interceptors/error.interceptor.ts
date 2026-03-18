import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.messages) {
        const messages = Object.values(error.error.messages);
        errorMessage = messages.join(', ');
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please ensure the backend is running.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'Duplicate resource';
      }

      console.error('HTTP Error:', error.status, errorMessage);
      return throwError(() => ({ status: error.status, message: errorMessage }));
    })
  );
};
