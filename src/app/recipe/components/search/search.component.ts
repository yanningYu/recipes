import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ingredientCtrl = new FormControl();
  filteredIngredients: Observable<string[]>;
  ingredients: string[] = [];
  allIngredients: string[] = ['garlic', 'eggs', 'butter', 'bacon', 'salt'];

  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Output() searchClick = new EventEmitter<string>();
  title = '';
  constructor() {
    this.filteredIngredients = this.ingredientCtrl.valueChanges.pipe(
      startWith(null),
      map((ingredient: string | null) => ingredient ? this._filter(ingredient) : this.allIngredients.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our ingredient
    if ((value || '').trim()) {
      this.ingredients.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.ingredientCtrl.setValue(null);
  }

  remove(ingredient: string): void {
    const index = this.ingredients.indexOf(ingredient);

    if (index >= 0) {
      this.ingredients.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.ingredients.push(event.option.viewValue);
    this.ingredientInput.nativeElement.value = '';
    this.ingredientCtrl.setValue(null);
  }

  search = () => {
    const pre = '/?';
    this.title = this.title.trim();
    let filterCourse = '';
    let strIntegredient = this.ingredients.join(',');
    if (strIntegredient) {
      strIntegredient = 'i=' + strIntegredient + '&';
    }

    if (this.title) {
      filterCourse = 'q=' + this.title;
    }

    if (filterCourse || strIntegredient) {
      this.searchClick.emit(pre + strIntegredient + filterCourse);
    } else {
      this.searchClick.emit('');
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allIngredients.filter(ingredient => ingredient.toLowerCase().indexOf(filterValue) === 0);
  }
}
