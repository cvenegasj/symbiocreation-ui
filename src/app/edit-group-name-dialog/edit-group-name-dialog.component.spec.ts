import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditGroupNameDialogComponent } from './edit-group-name-dialog.component';

describe('EditGroupNameDialogComponent', () => {
  let component: EditGroupNameDialogComponent;
  let fixture: ComponentFixture<EditGroupNameDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
