import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSymbioComponent } from './create-symbio.component';

describe('CreateSymbioComponent', () => {
  let component: CreateSymbioComponent;
  let fixture: ComponentFixture<CreateSymbioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSymbioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSymbioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
