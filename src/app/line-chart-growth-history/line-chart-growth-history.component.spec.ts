import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartGrowthHistoryComponent } from './line-chart-growth-history.component';

describe('LineChartGrowthHistoryComponent', () => {
  let component: LineChartGrowthHistoryComponent;
  let fixture: ComponentFixture<LineChartGrowthHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineChartGrowthHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineChartGrowthHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
