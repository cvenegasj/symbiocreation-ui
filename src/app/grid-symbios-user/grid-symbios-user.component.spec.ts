import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GridSymbiosUserComponent } from './grid-symbios-user.component';

describe('GridSymbiosUserComponent', () => {
  let component: GridSymbiosUserComponent;
  let fixture: ComponentFixture<GridSymbiosUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSymbiosUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSymbiosUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
