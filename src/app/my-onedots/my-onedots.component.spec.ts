import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOnedotsComponent } from './my-onedots.component';

describe('MyOnedotsComponent', () => {
  let component: MyOnedotsComponent;
  let fixture: ComponentFixture<MyOnedotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyOnedotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOnedotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
