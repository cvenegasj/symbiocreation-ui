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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FormsModule,
    HttpClientModule,
    ClipboardModule,
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'dymje6shc', upload_preset: 'u6pnku96'}),
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
