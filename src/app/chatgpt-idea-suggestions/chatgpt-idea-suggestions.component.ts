import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { Idea, IdeaAI } from '../models/symbioTypes';
import { Node } from '../models/forceGraphTypes';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { EditIdeaDialogComponent } from '../edit-idea-dialog/edit-idea-dialog.component';

@Component({
  selector: 'app-chatgpt-idea-suggestions',
  templateUrl: './chatgpt-idea-suggestions.component.html',
  styleUrl: './chatgpt-idea-suggestions.component.css'
})
export class ChatgptIdeaSuggestionsComponent implements OnInit {

  @Input() symbiocreationId: string;
  @Input() node: Node;

  @Output() changedIdea = new EventEmitter<Idea>();

  isLoadingLlmResponse: boolean = true;
  ideasSuggested: IdeaAI[];

  constructor(
    public auth: AuthService,
    private symbioService: SymbiocreationService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.node.children) {
      this.symbioService.getIdeasForGroupFromLlm(this.symbiocreationId, this.node.id)
        .subscribe(ideas => {
          this.isLoadingLlmResponse = false;
          this.ideasSuggested = ideas;
        });
    } else {
      this.symbioService.getIdeasForSymbioFromLlm(this.symbiocreationId)
        .subscribe(ideas => {
          this.isLoadingLlmResponse = false;
          this.ideasSuggested = ideas;
        });
    }
  }

  openEditIdeaDialog(ideaAi: IdeaAI) {
    if (!this.auth.loggedIn) {
      this.auth.login(`/symbiocreation/${this.symbiocreationId}/idea/${this.node.id}`);
      return;
    }

    const dialogRef = this.dialog.open(EditIdeaDialogComponent, {
      width: '650px',
      data: {
        name: this.node.name,
        idea: {title: ideaAi.title, description: ideaAi.description}
      }
    });

    dialogRef.afterClosed().subscribe(idea => {
      if (idea) {
        this.changedIdea.emit(idea);
      }
    });
  }

}
