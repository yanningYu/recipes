import { MainContentComponent } from './components/main-content/main-content.component';
import { RecipeAppComponent } from './components/recipe-app/recipe-app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RecipeAppComponent,
    children:[
      {
        path: '', component: MainContentComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }
