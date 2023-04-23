import { Team } from "./team.model";

export interface Game {
    date: Date;
    home_team: Team;
    home_team_score: number;
    id: number;
    period: number;
    postseason: boolean;
    season: number;
    status: Date;
    time: any;
    visitor_team: Team;
    visitor_team_score: number;
}