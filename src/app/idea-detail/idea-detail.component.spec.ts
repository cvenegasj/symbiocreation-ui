import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IdeaDetailComponent } from './idea-detail.component';

describe('IdeaDetailComponent', () => {
  let component: IdeaDetailComponent;
  let fixture: ComponentFixture<IdeaDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
