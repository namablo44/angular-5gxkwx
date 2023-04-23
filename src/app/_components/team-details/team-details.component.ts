import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../../_models/team.model';
import { ApiService } from '../../_services/api.service';
import { Game } from 'src/app/_models/game.model';
import { Observer, PartialObserver, forkJoin } from 'rxjs';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css'],
})
export class TeamDetailsComponent {
  team: Team;
  teamLoadingStatus: string | undefined;
  gamesLoadingStatus: string | undefined;
  loadingStatus: string | undefined;

  constructor(private _route: ActivatedRoute, private _api: ApiService) { }
  teamId: number;
  games: any[] = [];

  ngOnInit(): void {
    //retreive id from URL
    this.teamId = this._route.snapshot.params['id'];

    //retreive data from APIs
    this.loadingStatus = 'Loading... Please wait.';
    forkJoin({
      team: this._api.getOneTeam(this.teamId),
      games: this._api.getLastGamesForTeam(this.teamId, 12)
    }).subscribe({
      next: (result) => {
        this.team = result.team;
        this.games = result.games;
        this.loadingStatus = undefined;
      },
      error: () => {
        this.loadingStatus =
          'An error occurs during the loading. Please retry.';
      },
    })
  }
}
