import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CameraCaptureDialogComponent } from './camera-capture-dialog.component';

describe('CameraCaptureDialogComponent', () => {
  let component: CameraCaptureDialogComponent;
  let fixture: ComponentFixture<CameraCaptureDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraCaptureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraCaptureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
