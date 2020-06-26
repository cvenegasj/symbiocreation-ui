import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Symbiocreation, Participant } from '../models/symbioTypes';
import { Node } from '../models/forceGraphTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { concatMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-symbio',
  templateUrl: './create-symbio.component.html',
  styleUrls: ['./create-symbio.component.css']
})
export class CreateSymbioComponent implements OnInit {

  model: Symbiocreation;

  constructor(
    private symbioService: SymbiocreationService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.model = { name: '', enabled: true, visibility: 'public', participants: [] };
  }

  onSubmit() {
    this.model.lastModified = new Date();
    this.model.participants = [];
    this.model.graph = [];
    
    // add creator as participant w role 'moderator'
    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(u => {
        this.model.participants.push({u_id: u.id, role: 'moderator'} as Participant); // participant
        this.model.graph.push({id: uuidv4(), u_id: u.id, name: u.firstName} as Node); // node

        return this.symbioService.createSymbiocreation(this.model);
      })
    ).subscribe(res => {
      this._snackBar.open('Se creó la simbiocreación.', 'ok', {
        duration: 2000,
      });
      this.router.navigate(['/symbiocreation', res.id]);
    });
  }

}
