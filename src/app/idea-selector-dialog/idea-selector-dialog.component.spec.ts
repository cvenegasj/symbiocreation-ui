import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaSelectorDialogComponent } from './idea-selector-dialog.component';

describe('IdeaSelectorDialogComponent', () => {
  let component: IdeaSelectorDialogComponent;
  let fixture: ComponentFixture<IdeaSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeaSelectorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
