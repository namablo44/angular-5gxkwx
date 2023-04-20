import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../../_models/team.model';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css'],
})
export class TeamDetailsComponent {
  team: Team;
  loadingStatus: string | undefined;
  constructor(private _route: ActivatedRoute, private _api: ApiService) {}
  teamId: number;
  ngOnInit() {
    this.teamId = this._route.snapshot.params['id'];
    this.loadingStatus = 'Team loading... Please wait.';
    this._api.getOneTeam(this.teamId).subscribe({
      next: (team: Team) => {
        this.loadingStatus = undefined;
        this.team = team;
      },
      error: () => {
        this.loadingStatus =
          'An error occurs during the loading. Please retry.';
      },
    });
  }
}
