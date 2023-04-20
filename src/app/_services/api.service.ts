import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, concat, of } from 'rxjs';
import { concatMap, expand, map, reduce } from 'rxjs/operators';
import { Team } from '../_models/team.model';

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

/*
interface AllGamesApiResponse {
  data: any[];
  meta: {
    current_page: number;
    next_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  }
}
*/

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

  /*
  //method unused because of a bug in API provider : filter on team_ids does not have any effect... :-/
  getGamesForTeam(id: number): Observable<any> {
    const url = `https://free-nba.p.rapidapi.com/games`;
    const idAsArray = [id];
    const params = new HttpParams().set('team_ids', idAsArray.join(', '))
    return this._http.get<Team>(`${url}`, {headers: this.HEADERS, params: params})
  }
  */

}
