import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientJsonpModule } from '@angular/common/http';
import { Cloudinary } from '@cloudinary/angular-5.x'; 

@Injectable({
    providedIn: 'root',
})
export class ImageService {

    //apiUrl: string = 'http://cloudinary....';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient,
        private cloudinary: Cloudinary 
    ) { }

    uploadImage(image: File): Observable<any> {
        let API_URL = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`;
        
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', this.cloudinary.config().upload_preset);

        return this.http.post(API_URL, formData)
            .pipe(
                catchError(this.error)
            );
    }

    // Handle Errors 
    error(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }
}