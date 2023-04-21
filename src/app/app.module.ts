import 'zone.js'; //necessary for stackblitz

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TeamsExplorerComponent } from './_components/teams-explorer/teams-explorer.component';
import { TeamCardComponent } from './_components/team-card/team-card.component';
import { TeamDetailsComponent } from './_components/team-details/team-details.component';
import { ApiService } from './_services/api.service';

const ROUTES: Routes = [
  { path: 'results/:id', component: TeamDetailsComponent },
  { path: '**', component: TeamsExplorerComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    TeamsExplorerComponent,
    TeamCardComponent,
    TeamDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { enableTracing: true }),
    FormsModule,
  ],
  providers: [ApiService],
  exports: [RouterModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
