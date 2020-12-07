import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewGroupDialogComponent } from './new-group-dialog.component';

describe('NewGroupDialogComponent', () => {
  let component: NewGroupDialogComponent;
  let fixture: ComponentFixture<NewGroupDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
