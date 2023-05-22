import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOnedotComponent } from './create-onedot.component';

describe('CreateOnedotComponent', () => {
  let component: CreateOnedotComponent;
  let fixture: ComponentFixture<CreateOnedotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOnedotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOnedotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
