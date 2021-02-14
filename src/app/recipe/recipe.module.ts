import { SearchComponent } from './components/search/search.component';
import { RecipeService } from './services/recipe.service';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { RecipeAppComponent } from './components/recipe-app/recipe-app.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeRoutingModule } from './recipe-routing.module';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    RecipeAppComponent,
    SideNavComponent,
    MainContentComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RecipeRoutingModule
  ],
  providers:[
    RecipeService
  ]
})
export class RecipeModule { }
