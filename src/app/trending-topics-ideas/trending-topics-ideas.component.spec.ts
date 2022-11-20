import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingTopicsIdeasComponent } from './trending-topics-ideas.component';

describe('TrendingTopicsIdeasComponent', () => {
  let component: TrendingTopicsIdeasComponent;
  let fixture: ComponentFixture<TrendingTopicsIdeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingTopicsIdeasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingTopicsIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
