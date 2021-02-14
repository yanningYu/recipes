import { IRecipe } from './../interfaces/i-recipe';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer, forkJoin } from 'rxjs';
import { map, shareReplay, tap, switchMap, filter } from 'rxjs/operators';

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
          tap(data => console.log('recipes', data))
        );
    })
  );
}
