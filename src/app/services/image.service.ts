import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';

@Injectable({
    providedIn: 'root',
})
export class ImageService {

    UPLOAD_PRESET: string = 'u6pnku96';

    // Create a Cloudinary instance and set your cloud name.
    cloudinary = new Cloudinary({cloud: { cloudName: 'dymje6shc' }});

    constructor(
        private http: HttpClient
    ) { }

    uploadImage(image: File): Observable<any> {
        const API_URL = `https://api.cloudinary.com/v1_1/${this.cloudinary.getConfig().cloud.cloudName}/upload`;
        
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', this.UPLOAD_PRESET);

        return this.http.post(API_URL, formData)
            .pipe(
                catchError(this.error)
            );
    }

    getImage(publicId: string): CloudinaryImage {
        return this.cloudinary.image(publicId);
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