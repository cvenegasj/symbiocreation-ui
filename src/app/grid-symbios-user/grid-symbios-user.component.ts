import { Component, OnInit, Input } from '@angular/core';
import { Symbiocreation, Participant } from '../models/symbioTypes';
import { MatDialog } from '@angular/material/dialog';
import { SymbiocreationDetailComponent } from '../symbiocreation-detail/symbiocreation-detail.component';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { EditGroupNameDialogComponent } from '../edit-group-name-dialog/edit-group-name-dialog.component';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-grid-symbios-user',
  templateUrl: './grid-symbios-user.component.html',
  styleUrls: ['./grid-symbios-user.component.css']
})
export class GridSymbiosUserComponent implements OnInit {

  @Input() symbiocreations: Symbiocreation[];
  @Input() isModeratorList: boolean[];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private symbioService: SymbiocreationService,
    public imageService: ImageService,
  ) { }

  ngOnInit(): void {
  }

  deleteSymbiocreation(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar simbiocreación',
        content: '¿Está seguro que desea eliminar esta simbiocreación? Todos los datos se perderán para siempre.',
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
        confirmationColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.symbioService.deleteSymbiocreation(id).subscribe(
          res => {
            this.symbiocreations = this.symbiocreations.filter(s => s.id !== id);
          });
      }
    });
  }

  changeNameSymbiocreation(symbio: Symbiocreation) {
    const dialogRef = this.dialog.open(EditGroupNameDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        symbio.name = name;
        this.symbioService.updateSymbiocreationName(symbio).subscribe();
      }
    });
  }

  openSymbioDetailDialog(symbio: Symbiocreation, isModerator: boolean) {
    const dialogRef = this.dialog.open(SymbiocreationDetailComponent, {
      width: '600px',
      data: {
        symbio: symbio,
        isModerator: isModerator
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  editSymbiocreationInfo(symbio: Symbiocreation) {
    this.router.navigateByUrl(`/edit/${symbio.id}`);
  }

  getParticipantsToDisplay(participants: Participant[]): Participant[] {
    let selected: Participant[] = [];
    // include moderators w picture
    let i = 0;
    while (i < participants.length && selected.length < 5) {
      if (participants[i].isModerator && participants[i].user.pictureUrl)
        selected.push(participants[i]);
      i++;
    }

    i = 0;
    // fill 5 spots w/ participants
    while (i < participants.length && selected.length < 5) {
      if (!participants[i].isModerator && participants[i].user.pictureUrl)
        selected.push(participants[i]);
      i++;
    }
    return selected;
  }

  computeNMoreSpanWidth(totalLength: number, diplayedLength: number): number {
    return totalLength - diplayedLength > 0 ? 50 : 0;
  }

  getTimeAgo(lastModified: number): string {
    moment.locale('es');
    return moment(lastModified).fromNow();
  }

}
