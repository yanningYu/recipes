import { IRecipe } from './../interfaces/i-recipe';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { map, shareReplay, tap, switchMap, filter, catchError } from 'rxjs/operators';

@Injectable()
export class RecipeService {
  private url = '/api';

  constructor(private http: HttpClient) { }

  private searchFilterSubject = new BehaviorSubject<string>('');
  private searchFilter$ = this.searchFilterSubject.asObservable().pipe(shareReplay(1));

  private updateRecipeSiwtchSubject = new BehaviorSubject<boolean>(true);
  private updateRecipeSwitch$ = this.updateRecipeSiwtchSubject.asObservable();

  _searchFilter: string = '';
  public set searchFilter(value: string) {
    this._searchFilter = value;
    this.searchFilterSubject.next(value);
  }
  public get searchFilter() {
    return this._searchFilter
  }
  public set updateRecipeSwitch(value: boolean) {
    this.updateRecipeSiwtchSubject.next(value);
  }

  updatedrecipe$ = this.updateRecipeSwitch$.pipe(
    filter(updateSwitch => Boolean(updateSwitch)),
    switchMap(() => this.recipeByIntegredients$.pipe(
      tap(() => this.updateRecipeSiwtchSubject.next(false))
    )));

  private recipeByIntegredients$ = this.searchFilter$.pipe(
    switchMap((strFilter: string) => {
      console.log('get recipes url', this.url + strFilter);
      return this.http.get<IRecipe[]>(this.url + strFilter)
        .pipe(
          map((data: any) => data.results as IRecipe[]),
          tap(data => console.log('recipes', data)),
          catchError(this.handleError)
        );
    })
  );

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
