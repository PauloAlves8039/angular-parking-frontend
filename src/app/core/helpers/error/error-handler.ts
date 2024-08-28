import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export class ErrorHandler {

  static getErrorMessage(_error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (_error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${_error.error.message}`;
    } else {
      errorMessage = `Error Status: ${_error.status}\nMessage: ${_error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
