import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSymbiosUserComponent } from './grid-symbios-user.component';

describe('GridSymbiosUserComponent', () => {
  let component: GridSymbiosUserComponent;
  let fixture: ComponentFixture<GridSymbiosUserComponent>;

  beforeEach(async(() => {
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
