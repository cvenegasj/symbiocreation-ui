import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSymbiocreationDetailComponent } from './edit-symbiocreation-detail.component';

describe('EditSymbiocreationDetailComponent', () => {
  let component: EditSymbiocreationDetailComponent;
  let fixture: ComponentFixture<EditSymbiocreationDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSymbiocreationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSymbiocreationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
