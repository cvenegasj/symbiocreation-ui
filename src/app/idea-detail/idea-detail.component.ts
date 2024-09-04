import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Node } from '../models/forceGraphTypes';
import { Comment } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { concatMap } from 'rxjs/operators';
import { from } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditIdeaDialogComponent } from '../edit-idea-dialog/edit-idea-dialog.component';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-idea-detail',
  templateUrl: './idea-detail.component.html',
  styleUrls: ['./idea-detail.component.scss']
})
export class IdeaDetailComponent implements OnInit, AfterViewInit {

  node: Node;
  nameToShow: string;
  //sessionIsModerator: boolean = false;

  rating: number = 3.5;
  comment: string = '';
  hiddenCommentButtons: boolean = true;

  // Carrousel
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  isDragging = false;
  startX = 0;
  scrollLeft = 0;
  dragSpeedMultiplier = 1.5;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public sidenavService: SidenavService,
    private symbioService: SymbiocreationService,
    private userService: UserService,
    public auth: AuthService,
    public sharedService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public imageService: ImageService,
    public renderer: Renderer2,
    ) {}

  ngOnInit(): void {
    this.subscribeToParams();
    /*this.sharedService.sessionIsModerator$.subscribe(isModerator => {
      if (isModerator) this.sessionIsModerator = isModerator;
    }); */
  }

  ngAfterViewInit() {
    setTimeout(() => this.sidenavService.open(), 0); // to allow sidenav to be injected properly
  }

  subscribeToParams() {
    const idSymbio = this.route.parent.snapshot.paramMap.get('id');

    this.route.params.pipe(
      concatMap(routeParams => this.symbioService.getNodeById(idSymbio, routeParams.idNode))
    ).subscribe(node => { // node injected w user
      this.node = node;
      this.nameToShow = this.node.name;
    });
  }

  toggleFullscreen() {
    this.sidenavService.toggleFullscreen();
  }

  closeIdeaDetail() {
    const closed$ = from(this.sidenavService.close());
    closed$.subscribe(res => {
      this.router.navigate(['.'], {relativeTo: this.route.parent});
      //this.sharedService.nextDeselectedNodes([this.node]);
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

  postComment() {
    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(u => {
        const newComment: Comment = {u_id: u.id, content: this.comment};
        const idSymbio = this.route.parent.snapshot.paramMap.get('id');
        return this.symbioService.createCommentOfIdea(idSymbio, this.node.id, newComment);
      })
    ).subscribe(comment => {
      if (!this.node.idea.comments) {
        this.node.idea.comments = [];
      }
      this.node.idea.comments.push(comment);
      this.comment = '';
      this._snackBar.open('Se registró tu comentario correctamente.', 'ok', {
        duration: 2000,
      });
    });
  }

  moveLeft() {
    const width = this.carouselTrack.nativeElement.clientWidth;
    this.carouselTrack.nativeElement.scrollLeft -= width;
  }

  moveRight() {
    const width = this.carouselTrack.nativeElement.clientWidth;
    this.carouselTrack.nativeElement.scrollLeft += width;
  }

  onMouseDown(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    const startX = 'touches' in event ? event.touches[0].pageX : event.pageX;
    this.startX = startX - this.carouselTrack.nativeElement.offsetLeft;
    this.scrollLeft = this.carouselTrack.nativeElement.scrollLeft;
    this.renderer.setStyle(this.carouselTrack.nativeElement, 'cursor', 'grabbing');
  }

  onMouseLeave() {
    this.isDragging = false;
    this.renderer.setStyle(this.carouselTrack.nativeElement, 'cursor', 'grab');
  }

  onMouseUp() {
    this.isDragging = false;
    this.renderer.setStyle(this.carouselTrack.nativeElement, 'cursor', 'grab');
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = 'touches' in event ? event.touches[0].pageX : event.pageX;
    const walk = (x - this.startX) * this.dragSpeedMultiplier; // Aumenta la distancia de desplazamiento
    this.carouselTrack.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

}
