import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSymbiocreationDetailComponent } from './edit-symbiocreation-detail.component';

describe('EditSymbiocreationDetailComponent', () => {
  let component: EditSymbiocreationDetailComponent;
  let fixture: ComponentFixture<EditSymbiocreationDetailComponent>;

  beforeEach(async(() => {
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
