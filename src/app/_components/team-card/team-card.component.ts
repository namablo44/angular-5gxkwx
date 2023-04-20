import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '../../_models/team.model';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css'],
})
export class TeamCardComponent implements OnInit {
  @Input('team') team: Team;
  @Output('onRemove') onRemoveItemEvent = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.onRemoveItemEvent.emit(this.team.id);
  }
}
