import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '../../_models/team.model';
import { Game } from 'src/app/_models/game.model';
import { ApiService } from 'src/app/_services/api.service';

interface gameSummary {
  result: string,
  scored: number,
  conceded: number
}

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css'],
})
export class TeamCardComponent implements OnInit {
  @Input('team') team: Team;
  @Output('onRemove') onRemoveItemEvent = new EventEmitter<number>();
  gamesLoadingStatus: string | undefined;

  avgScored: number = 0;
  avgConceded: number = 0;
  
  gamesSummary: gameSummary[] = [];

  constructor(private _api: ApiService) {}

  ngOnInit(): void {

    //retreive games
    this.gamesLoadingStatus = 'Games loading... Please wait.';
    this._api.getLastGamesForTeam(this.team.id, 12).subscribe({
      next: (games: Game[]) => {
        this.gamesLoadingStatus = undefined;
        
        for(let game of games){
            //teams profil
            const teamProfil = game.home_team.id==this.team.id ? 'home' : 'visitor';
            const opponentPRofil = teamProfil=='visitor' ? 'home' : 'visitor';
            
            //scores
            const scored: number[] = [];
            scored.push(game[`${teamProfil}_team_score` as keyof Game]);
            const conceded: number[] = [];
            conceded.push(game[`${opponentPRofil}_team_score` as keyof Game]);

            //status
            let won: boolean = game[`${teamProfil}_team_score` as keyof Game] > game[`${opponentPRofil}_team_score` as keyof Game];
            let lost: boolean = game[`${teamProfil}_team_score` as keyof Game] < game[`${opponentPRofil}_team_score` as keyof Game];
            let result = won ? 'won' : lost ? 'lost' : 'equality';

            //summary
            this.gamesSummary.push({
              result: result,
              scored: game[`${teamProfil}_team_score` as keyof Game],
              conceded: game[`${opponentPRofil}_team_score` as keyof Game]
            })
        }
        
        //averages
        this.avgScored = Math.round(this.averageOfPoints(this.gamesSummary.map((x:gameSummary)=>x.scored)));
        this.avgConceded = Math.round(this.averageOfPoints(this.gamesSummary.map((x:gameSummary)=>x.conceded)));
        
      },
      error: () => {
        this.gamesLoadingStatus =
          'An error occurs during the loading. Please retry.';
      },
    });

  }

  averageOfPoints(values: number[]): number {
    if(values.length == 0) return 0;
    else {
      return values.reduce((a: number, b: number) => a + b, 0) / values.length;
    }
  }

  close(): void {
    this.onRemoveItemEvent.emit(this.team.id);
  }
}
