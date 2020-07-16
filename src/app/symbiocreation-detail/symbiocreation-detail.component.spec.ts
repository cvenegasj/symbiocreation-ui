import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbiocreationDetailComponent } from './symbiocreation-detail.component';

describe('SymbiocreationDetailComponent', () => {
  let component: SymbiocreationDetailComponent;
  let fixture: ComponentFixture<SymbiocreationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbiocreationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbiocreationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
