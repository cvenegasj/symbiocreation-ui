import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatgptIdeaSuggestionsComponent } from './chatgpt-idea-suggestions.component';

describe('ChatgptIdeaSuggestionsComponent', () => {
  let component: ChatgptIdeaSuggestionsComponent;
  let fixture: ComponentFixture<ChatgptIdeaSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatgptIdeaSuggestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatgptIdeaSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
