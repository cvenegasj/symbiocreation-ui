import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SymbiocreationComponent } from './symbiocreation/symbiocreation.component';
import { IdeaDetailComponent } from './idea-detail/idea-detail.component';
import { GraphComponent } from './graph/graph.component';
import { ExploreComponent } from './explore/explore.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateSymbioComponent } from './create-symbio/create-symbio.component';
import { NewGroupDialogComponent } from './new-group-dialog/new-group-dialog.component';
import { EditIdeaDialogComponent } from './edit-idea-dialog/edit-idea-dialog.component';
import { EditGroupNameDialogComponent } from './edit-group-name-dialog/edit-group-name-dialog.component';
import { CameraCaptureDialogComponent } from './camera-capture-dialog/camera-capture-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { SymbiocreationDetailComponent } from './symbiocreation-detail/symbiocreation-detail.component';
import { EditSymbiocreationDetailComponent } from './edit-symbiocreation-detail/edit-symbiocreation-detail.component';
import { GridSymbiosUserComponent } from './grid-symbios-user/grid-symbios-user.component';
import { ListSymbiosUserComponent } from './list-symbios-user/list-symbios-user.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SymbiocreationComponent,
    IdeaDetailComponent,
    GraphComponent,
    ExploreComponent,
    ProfileComponent,
    CreateSymbioComponent,
    NewGroupDialogComponent,
    EditIdeaDialogComponent,
    EditGroupNameDialogComponent,
    CameraCaptureDialogComponent,
    ConfirmationDialogComponent,
    SymbiocreationDetailComponent,
    EditSymbiocreationDetailComponent,
    GridSymbiosUserComponent,
    ListSymbiosUserComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FormsModule,
    HttpClientModule,
    ClipboardModule,
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'dymje6shc', upload_preset: 'u6pnku96'}),
    MatMomentDateModule,
    MomentTimezonePickerModule,
    
  ],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {strict: true, useUtc: true}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
