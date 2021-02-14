import { mergeMap, shareReplay, tap, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { IRecipe } from '../../interfaces/i-recipe';
import { RecipeService } from '../../services/recipe.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MainContentComponent implements OnInit {

  columnsToDisplay = ['title', 'thumbnail', 'favorite',];
  constructor(private recipeService: RecipeService) { }
  expandedElement: IRecipe | null;
  recipes$: Observable<IRecipe[]>;

  // private showNotificationSubject = new Subject<boolean>();
  // showNotification$: Observable<boolean> = this.showNotificationSubject;

  showNotification = false;
  ngOnInit() {
    this.recipes$ = timer(0, 10000).pipe(
      tap((number) => {
        if (number) {
          this.showNotification = true;
        }
      }),
      switchMap(() => this.recipeService.updatedrecipe$),
      shareReplay(1));
  }

  search = (strFilter: string) => {
    if ( this.recipeService.searchFilter !== strFilter || this.showNotification) {
      this.showNotification = false;
      this.recipeService.updateRecipeSwitch = true;
      this.recipeService.searchFilter = strFilter;
    }
  }

  toggleFavoriteFood = (recipe: IRecipe) => {
    recipe.isFavorite = !recipe.isFavorite;
  }
}
