import { Component, OnInit, Input } from '@angular/core';
import { Symbiocreation } from '../models/symbioTypes';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { EditGroupNameDialogComponent } from '../edit-group-name-dialog/edit-group-name-dialog.component';
import { SymbiocreationDetailComponent } from '../symbiocreation-detail/symbiocreation-detail.component';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list-symbios-user',
  templateUrl: './list-symbios-user.component.html',
  styleUrls: ['./list-symbios-user.component.css']
})
export class ListSymbiosUserComponent implements OnInit {

  environment = environment;

  @Input() symbiocreations: Symbiocreation[];
  @Input() isModeratorList: boolean[];
  
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private symbioService: SymbiocreationService
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

}
