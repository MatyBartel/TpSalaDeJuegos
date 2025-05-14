import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordGameComponent } from './word-game.component';

const routes: Routes = [
  { path: '', component: WordGameComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WordGameRoutingModule {}
