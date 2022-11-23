import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbiocreationsStatsComponent } from './symbiocreations-stats.component';

describe('SymbiocreationsStatsComponent', () => {
  let component: SymbiocreationsStatsComponent;
  let fixture: ComponentFixture<SymbiocreationsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbiocreationsStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymbiocreationsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
