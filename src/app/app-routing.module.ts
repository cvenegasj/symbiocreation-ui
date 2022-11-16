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
import { StatsOverviewComponent } from './stats-overview/stats-overview.component';
import { MySymbiocreationsComponent } from './my-symbiocreations/my-symbiocreations.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard/my-symbios', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'my-symbios', component: MySymbiocreationsComponent },
      { path: 'stats-overview', component: StatsOverviewComponent },
    ]
  },
  { path: 'explore', component: ExploreComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'symbiocreation/:id', component: SymbiocreationComponent, 
    children: [
      { path: 'idea/:idNode', component: IdeaDetailComponent }
    ] 
  },
  { path: 'create', component: CreateSymbioComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EditSymbiocreationDetailComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'disabled', relativeLinkResolution: 'legacy' })], // disable initialNavigation for Auth0 to work
  exports: [RouterModule]
})
export class AppRoutingModule { }
