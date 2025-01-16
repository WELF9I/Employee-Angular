import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembreComponent } from './membre/membre.component';



const routes: Routes = [
  {
    component:MembreComponent,path:"membre"
  },
  {
    component:MembreComponent,path:""
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
