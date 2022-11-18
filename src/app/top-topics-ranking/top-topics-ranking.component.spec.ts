import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTopicsRankingComponent } from './top-topics-ranking.component';

describe('TopTopicsRankingComponent', () => {
  let component: TopTopicsRankingComponent;
  let fixture: ComponentFixture<TopTopicsRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTopicsRankingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTopicsRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
