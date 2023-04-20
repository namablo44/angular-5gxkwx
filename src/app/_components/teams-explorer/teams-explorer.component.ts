import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Team } from '../../_models/team.model';
import { ApiService } from '../../_services/api.service';
import { TeamCardComponent } from '../team-card/team-card.component';


@Component({
  selector: 'app-teams-explorer',
  templateUrl: './teams-explorer.component.html',
  styleUrls: ['./teams-explorer.component.css'],
})
export class TeamsExplorerComponent implements OnInit {
  allTeams: Team[] = [];
  selectedTeamId: number;
  loadingStatus: string | undefined;

  @ViewChild('teamCardsContainer', { read: ViewContainerRef })
  viewRef: ViewContainerRef;
  componentRefs: ComponentRef<TeamCardComponent>[] = [];

  constructor(private _api: ApiService, private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadingStatus = 'Teams loading... Please wait.';
    this._api.getAllTeams().subscribe({
      next: (teams: Team[]) => {
        this.loadingStatus = undefined;
        this.allTeams = teams.sort((a: Team, b: Team) =>
          a.full_name.localeCompare(b.full_name)
        );
      },
      error: () => {
        this.loadingStatus =
          'An error occurs during the loading. Please retry.';
      },
    });
  }

  addTeam(id: number): void {
    //create the card component
    const componentRef = this.viewRef.createComponent(TeamCardComponent);
    const selectedTeam = this.allTeams.find(
      (team: Team) => team.id == this.selectedTeamId
    );
    if (selectedTeam) {
      componentRef.instance.team = selectedTeam; //input parameter of the component

      const sub = componentRef.instance.onRemoveItemEvent.subscribe(
        (id: number) => {
          this.removeTeam(id);
        }
      ); //listen to the close event
      componentRef.onDestroy(() => {
        sub.unsubscribe();
      }); //not listen anymore the close event after card has been destroyed
      this.componentRefs.push(componentRef);

      //track the team
      this.allTeams.forEach((team: Team) => {
        if (team.id == this.selectedTeamId) team.isTracked = true;
      });
    }
  }

  removeTeam(id: number): void {
    //remove the card component
    const componentToRemove = this.componentRefs.find(
      (componentRef: ComponentRef<TeamCardComponent>) =>
        componentRef.instance.team.id == id
    );
    if (componentToRemove) {
      componentToRemove.destroy();
      //untrack the team
      this.allTeams.forEach((team: Team) => {
        if (team.id == this.selectedTeamId) team.isTracked = false;
      });
    }
  }
}
