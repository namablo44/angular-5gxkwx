import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, concat, from, of } from 'rxjs';
import { concatMap, expand, map, reduce } from 'rxjs/operators';
import { Team } from '../_models/team.model';
import { Game } from '../_models/game.model';
import { todayDate } from '../environment';

interface AllTeamsApiResponse {
  data: Team[];
  meta: {
    current_page: number;
    next_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  }
}

interface AllGamesApiResponse {
  data: Game[];
  meta: {
    current_page: number;
    next_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  HEADERS = new HttpHeaders({
    'X-RapidAPI-Key':'2QMXSehDLSmshDmRQcKUIAiQjIZAp1UvKUrjsnewgqSP6F5oBX',
    'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
  })

  getAllTeams(): Observable<Team[]> {
    const url = `https://free-nba.p.rapidapi.com/teams`;
    return this._http.get<AllTeamsApiResponse>(`${url}?page=1`, {headers: this.HEADERS}).pipe(//get first page
      expand((response: AllTeamsApiResponse) => {//get next pages with recursively call (see https://www.learnrxjs.io/learn-rxjs/operators/transformation/expand)
        const currentPage: number = response.meta.current_page;
        const totalPages: number = response.meta.total_pages;
        if (currentPage < totalPages) {
          return this._http.get<AllTeamsApiResponse>(`${url}?page=${currentPage+1}`, {headers: this.HEADERS})
        }
        return EMPTY;
      }),
      reduce((accumulator: Team[], current: AllTeamsApiResponse) => accumulator.concat(current.data), []) //put all items in a single array
    )
  }

  getOneTeam(id: number): Observable<Team> {
    const url = `https://free-nba.p.rapidapi.com/teams/${id}`;
    return this._http.get<Team>(`${url}`, {headers: this.HEADERS})
  }

  getLastGamesForTeam(id: number, numberOfDays: number): Observable<Game[]> {
    const datesFilter: any[] = [];
    let i = 0;
    while(i<numberOfDays){
      const newDate = new Date(todayDate);
      newDate.setDate(todayDate.getDate() - i);
      datesFilter.push(`&dates[]=${newDate.toISOString().split('T')[0]}`);
      i++;
    }
    const url = `https://free-nba.p.rapidapi.com/games?page=0&per_page=12&team_ids[]=${id}${datesFilter}`;
    return this._http.get<AllGamesApiResponse>(`${url}`, {headers: this.HEADERS}).pipe(map((result: AllGamesApiResponse)=>result.data));
  }

}
