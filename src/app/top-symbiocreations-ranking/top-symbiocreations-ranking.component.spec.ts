import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSymbiocreationsRankingComponent } from './top-symbiocreations-ranking.component';

describe('TopSymbiocreationsRankingComponent', () => {
  let component: TopSymbiocreationsRankingComponent;
  let fixture: ComponentFixture<TopSymbiocreationsRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopSymbiocreationsRankingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSymbiocreationsRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
