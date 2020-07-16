import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SymbiocreationComponent } from './symbiocreation/symbiocreation.component';
import { IdeaDetailComponent } from './idea-detail/idea-detail.component';
import { ExploreComponent } from './explore/explore.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateSymbioComponent } from './create-symbio/create-symbio.component';
import { EditSymbiocreationDetailComponent } from './edit-symbiocreation-detail/edit-symbiocreation-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'explore', component: ExploreComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'symbiocreation/:id', component: SymbiocreationComponent, 
    children: [
      { path: 'idea/:idNode', component: IdeaDetailComponent }
    ] 
  },
  { path: 'create', component: CreateSymbioComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EditSymbiocreationDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: 'disabled'})], // disable initialNavigation for Auth0 to work
  exports: [RouterModule]
})
export class AppRoutingModule { }
