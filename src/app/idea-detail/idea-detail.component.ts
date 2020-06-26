import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Node } from '../models/forceGraphTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
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

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private sidenav: SidenavService,
    private symbioService: SymbiocreationService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.getNode();
  }

  ngAfterViewInit() {
    setTimeout(()=> this.sidenav.open(), 0); // to allow sidenav to be injected properly
  }

  getNode() {
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
          this._snackBar.open('Se registró la idea correctamente.', 'ok', {
            duration: 2000,
          });
        });
      }
    });
  }

}
