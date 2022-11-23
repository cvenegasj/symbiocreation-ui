import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingUsersPublicComponent } from './ranking-users-public.component';

describe('RankingUsersPublicComponent', () => {
  let component: RankingUsersPublicComponent;
  let fixture: ComponentFixture<RankingUsersPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingUsersPublicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingUsersPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
