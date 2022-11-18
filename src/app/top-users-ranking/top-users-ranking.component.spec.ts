import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUsersRankingComponent } from './top-users-ranking.component';

describe('TopUsersRankingComponent', () => {
  let component: TopUsersRankingComponent;
  let fixture: ComponentFixture<TopUsersRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopUsersRankingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopUsersRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
