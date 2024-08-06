import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-camera-capture-dialog',
  templateUrl: './camera-capture-dialog.component.html',
  styleUrls: ['./camera-capture-dialog.component.css']
})
export class CameraCaptureDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  videoWidth = 0;
  videoHeight = 0;
  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };

  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CameraCaptureDialogComponent>,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then(this.attachVideo.bind(this))
        .catch(this.handleError);
    } else {
      //alert('Sorry, camera not available.');
      this._snackBar.open('Cámara no disponible.', null, {
        duration: 2000,
      });
    }
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  onCaptureClick() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    
    const base64Data = this.canvas.nativeElement.toDataURL("image/png");
    // transform base64Data to file
    const binary = atob(base64Data.split(',')[1]);
    let array = [];
    for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const file: any = new Blob([new Uint8Array(array)], {type: 'image/png'});
    file.lastModifiedDate = new Date();
    file.name = 'capturedImg';

    const imgSnippet = new ImageSnippet(base64Data, file);
    this.dialogRef.close(imgSnippet);
  }

  handleError(error) {
    console.log('Error: ', error);
  }

}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
