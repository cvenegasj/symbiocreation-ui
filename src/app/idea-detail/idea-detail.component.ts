import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Node } from '../models/forceGraphTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { concatMap } from 'rxjs/operators';
import { from } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditIdeaDialogComponent } from '../edit-idea-dialog/edit-idea-dialog.component';

@Component({
  selector: 'app-idea-detail',
  templateUrl: './idea-detail.component.html',
  styleUrls: ['./idea-detail.component.css']
})
export class IdeaDetailComponent implements OnInit, AfterViewInit {

  node: Node;
  nameToShow: string;
  roleOfLoggedIn: string;

  rating: number = 3.5;
  comment: string = '';
  hiddenCommentButtons: boolean = true;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public sidenav: SidenavService,
    private symbioService: SymbiocreationService,
    public auth: AuthService,
    public sharedService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.subscribeToParams();
    
    this.sharedService.role$.subscribe(role => {
      if (role) this.roleOfLoggedIn = role;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.sidenav.open(), 0); // to allow sidenav to be injected properly
  }

  subscribeToParams() {
    const idSymbio = this.route.parent.snapshot.paramMap.get('id');

    this.route.params.pipe(
      concatMap(routeParams => this.symbioService.getNodeById(idSymbio, routeParams.idNode))
    ).subscribe(node => { // node injected w user
      this.node = node;
      this.nameToShow = this.node.name;
      // get nameToShow from db object user
      //if (this.node.user) this.nameToShow = this.node.user.firstName && this.node.user.lastName ? this.node.user.firstName + ' ' + this.node.user.lastName : this.node.user.name;
      //else this.nameToShow = this.node.name;
    });
  }

  toggleFullscreen() {
    this.sidenav.toggleFullscreen();
  }

  closeIdeaDetail() {
    const closed$ = from(this.sidenav.close());
    closed$.subscribe(res => {
      this.router.navigate(['.'], {relativeTo: this.route.parent});
      this.sharedService.nextSelectedNode(null);
    }); // to avoid blank sidenav on closing
  }

  openEditIdeaDialog() {
    if (!this.auth.loggedIn) {
      const id = this.route.parent.snapshot.params.id;
      const ideaId = this.route.snapshot.params.idNode;
      this.auth.login(`/symbiocreation/${id}/idea/${ideaId}`);
      return;
    }

    const idSymbio = this.route.parent.snapshot.paramMap.get('id');

    const dialogRef = this.dialog.open(EditIdeaDialogComponent, {
      width: '550px',
      data: {
        name: this.nameToShow,
        idea: this.node.idea
      }
    });

    dialogRef.afterClosed().subscribe(idea => {
      if (idea) {
        this.node.idea = idea; // has id and new idea
        this.symbioService.updateNodeIdea(idSymbio, this.node).subscribe(res => {
          this.sharedService.nextNode(this.node);

          this._snackBar.open('Se registró la idea correctamente.', 'ok', {
            duration: 2000,
          });
        });
      }
    });
  }

  onRateChange(rating: number) {
    
  }

  cancelCommentPost() {
    this.comment = '';
    this.hiddenCommentButtons = true;
  }

}
