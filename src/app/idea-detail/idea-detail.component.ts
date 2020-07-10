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

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private sidenav: SidenavService,
    private symbioService: SymbiocreationService,
    public auth: AuthService,
    private sharedService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.subscribeToParams();
    
    /*this.route.paramMap
      //.pipe(map(() => window.history.state))
      .subscribe(
        () => console.log(history.state)
      );*/
    this.sharedService.role$.subscribe(role => {
      if (role) this.roleOfLoggedIn = role;
    });
  }

  ngAfterViewInit() {
    setTimeout(()=> this.sidenav.open(), 0); // to allow sidenav to be injected properly
  }

  subscribeToParams() {
    const idSymbio = this.route.parent.snapshot.paramMap.get('id');

    this.route.params.pipe(
      concatMap(routeParams => this.symbioService.getNodeById(idSymbio, routeParams.idNode))
    ).subscribe(node => { // node injected w user
      this.node = node;
      this.nameToShow = this.node.user ? this.node.user.firstName + ' ' + this.node.user.lastName : this.node.name; // bc 'Idea de Carlos E' as title is not cool. I want my last name!
    });
  }

  closeIdeaDetail() {
    const closed$ = from(this.sidenav.close());
    closed$.subscribe(res => this.router.navigate(['.'], {relativeTo: this.route.parent})); // to avoid blank sidenav on closing
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
      width: '450px',
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

}
