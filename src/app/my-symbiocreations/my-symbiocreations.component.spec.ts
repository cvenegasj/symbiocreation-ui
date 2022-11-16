import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySymbiocreationsComponent } from './my-symbiocreations.component';

describe('MySymbiocreationsComponent', () => {
  let component: MySymbiocreationsComponent;
  let fixture: ComponentFixture<MySymbiocreationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySymbiocreationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySymbiocreationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
