import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {SequenceComponent} from "./sequence/sequence.component";
import {CoursesComponent} from "./courses/courses.component";
import {parseDecoratorInputTransformFunction} from "@angular/compiler-cli/src/ngtsc/annotations/directive";
import {ReaderPdfComponent} from "./reader-pdf/reader-pdf.component";

const routes: Routes = [
  {
    path:'home',component:HomeComponent
  },
  {
    path:'',component:HomeComponent
  },
  {
    path:'sequence',component:SequenceComponent
  },
  {
    path:'cours',component:CoursesComponent
  },
  {
    path:'pdf',component:ReaderPdfComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
