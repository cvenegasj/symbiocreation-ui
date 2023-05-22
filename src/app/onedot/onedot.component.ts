import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { User } from '../models/symbioTypes';
import { OneDot, OneDotParticipant } from '../models/oneDotTypes';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavService } from '../services/sidenav.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { RSocketService } from '../services/rsocket.service';
import { SharedService } from '../services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { OneDotService } from '../services/onedot.service';
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-onedot',
  templateUrl: './onedot.component.html',
  styleUrls: ['./onedot.component.css']
})
export class OnedotComponent implements OnInit, OnDestroy {

  appUser?: User;
  participant: OneDotParticipant;
  oneDot: OneDot;

  _listFilter1: string = '';
  filteredParticipants: OneDotParticipant[];

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public sidenavService: SidenavService,
    private oneDotService: OneDotService,
    private userService: UserService,
    private auth: AuthService,
    private rSocketService: RSocketService,
    public sharedService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.sharedService.appUser$.subscribe(appUser => this.appUser = appUser);
    this.getData();
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy(): void {
    // this.rSocketService.disconnect();
    // console.log('ngOnDestroy');
  }

  getData(): void {
    this.sharedService.nextIsLoading(true);
    const id = this.route.snapshot.paramMap.get('id');

    this.oneDotService.getOneDot(id)
    .pipe(
      tap(o => {
        // console.log(o);
        this.oneDot = o;
        this.filteredParticipants = this.oneDot.participants;
      }),
      concatMap(o => this.auth.userProfile$),
    ).subscribe(usrProfile => {
      //console.log(usrProfile);
      if (this.auth.loggedIn) {
        for (let p of this.oneDot.participants) {
          if (p.user.email === usrProfile.email) {
            this.participant = p;
            break;
          }
        }
      }

      this.sharedService.nextIsLoading(false);
      
      // connect to socket for updates
      this.rSocketService.connectToOneDot(this.oneDot.id);
      this.rSocketService.oneDot$
        .subscribe(oneDot => {
          if (oneDot?.id === this.oneDot.id) { // to avoid pulling last oneDot with another id
            // console.log(oneDot);
            this.oneDot = oneDot;
            this.updateReferences();
          }
        });
    });
  }

  joinOneDot(btnParticipate: MatButton): void {
    if (!this.auth.loggedIn) {
      const id = this.route.snapshot.params.id;
      this.auth.login(`/onedot/${id}`);
      return;
    }

    btnParticipate.disabled = true;
    
    // add logged-in user as participant
    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(u => {
        this.participant = {u_id: u.id, user: u};
        return this.oneDotService.createParticipant(this.oneDot.id, this.participant);
      })
    ).subscribe(symbio => {
      this._snackBar.open('Se te agregó como participante.', 'ok', {
        duration: 2000,
      });
    });
  }

  // propagates changes to child graph component
  // called when received a new one dot from socket
  updateReferences(): void {
    // this.oneDot.grid = this.oneDot.grid.slice();
    this.filteredParticipants = this.oneDot.participants;

    // update logged-in user
    if (this.participant) {
      // look for my participant object
      for (let p of this.oneDot.participants) {
        if (p.user.email === this.participant.user.email) {
          //console.log(p);
          this.participant = p;
          break;
        }
      }
    }
  }

  onGridUpdated(arr: number[]): void {
    this.oneDot.grid[arr[0]][arr[1]] = arr[2];
    this.oneDotService.updateGridStatus(this.oneDot).subscribe(); 
  }
  




  // setter and getter for _listFilters
  get listFilter1(): string { 
    return this._listFilter1; 
  }
   
  set listFilter1(value: string) { 
    this._listFilter1 = value; 
    this.filteredParticipants = this.listFilter1 ? this.performFilter1(this.listFilter1) : this.oneDot.participants; 
  }

  performFilter1(filterBy: string): OneDotParticipant[] { 
    filterBy = filterBy.toLocaleLowerCase();  

    return this.oneDot.participants.filter(
      (p: OneDotParticipant) => {
        const name = p.user.firstName && p.user.lastName ? p.user.firstName + " " + p.user.lastName : p.user.name; 
        return name.toLocaleLowerCase().indexOf(filterBy) !== -1;
      }
    ); 
  }

}
