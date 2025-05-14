import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncuestaComponent } from './encuesta.component';
import { EncuestaRoutingModule } from './encuesta-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EncuestaComponent],
  imports: [
    CommonModule,
    EncuestaRoutingModule,
    FormsModule
  ]
})
export class EncuestaModule {}
