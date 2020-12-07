import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SymbiocreationComponent } from './symbiocreation.component';

describe('SymbiocreationComponent', () => {
  let component: SymbiocreationComponent;
  let fixture: ComponentFixture<SymbiocreationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbiocreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbiocreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
