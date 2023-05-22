import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnedotComponent } from './onedot.component';

describe('OnedotComponent', () => {
  let component: OnedotComponent;
  let fixture: ComponentFixture<OnedotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnedotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnedotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
