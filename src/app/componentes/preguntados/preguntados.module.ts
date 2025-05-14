import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntadosComponent } from './preguntados.component';
import { PreguntadosRoutingModule } from './preguntados-routing.module';

@NgModule({
  declarations: [PreguntadosComponent],
  imports: [
    CommonModule,
    PreguntadosRoutingModule 
  ]
})
export class PreguntadosModule {}
