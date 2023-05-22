import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnedotGridComponent } from './onedot-grid.component';

describe('OnedotGridComponent', () => {
  let component: OnedotGridComponent;
  let fixture: ComponentFixture<OnedotGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnedotGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnedotGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
