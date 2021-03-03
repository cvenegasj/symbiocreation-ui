import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIdeaConfirmationDialogComponent } from './new-idea-confirmation-dialog.component';

describe('NewIdeaConfirmationDialogComponent', () => {
  let component: NewIdeaConfirmationDialogComponent;
  let fixture: ComponentFixture<NewIdeaConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIdeaConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIdeaConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
