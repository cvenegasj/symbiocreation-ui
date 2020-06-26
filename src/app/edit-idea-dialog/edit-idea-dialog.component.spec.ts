import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIdeaDialogComponent } from './edit-idea-dialog.component';

describe('EditIdeaDialogComponent', () => {
  let component: EditIdeaDialogComponent;
  let fixture: ComponentFixture<EditIdeaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIdeaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIdeaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
