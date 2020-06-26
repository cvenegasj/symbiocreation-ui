import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupNameDialogComponent } from './edit-group-name-dialog.component';

describe('EditGroupNameDialogComponent', () => {
  let component: EditGroupNameDialogComponent;
  let fixture: ComponentFixture<EditGroupNameDialogComponent>;

  beforeEach(async(() => {
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
