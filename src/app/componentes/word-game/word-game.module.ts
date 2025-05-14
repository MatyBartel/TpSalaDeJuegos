import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordGameComponent } from './word-game.component';
import { WordGameRoutingModule } from './word-game-routing.module';
import { HttpClientModule } from '@angular/common/http'; 

@NgModule({
  declarations: [WordGameComponent],
  imports: [
    CommonModule,
    WordGameRoutingModule,
    HttpClientModule
  ]
})
export class WordGameModule {}
