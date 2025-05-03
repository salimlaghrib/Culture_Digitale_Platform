import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/user-layout/header/header.component';

import { HomeComponent } from './features/user/home/home.component';
import { SequenceComponent } from './features/user/sequence/sequence.component';


import { CoursesComponent } from './features/user/cours/courses.component';

import { PdfViewerModule } from "ng2-pdf-viewer";
import { FooterComponent } from './layout/user-layout/footer/footer.component';


import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CourSequenceComponent } from './features/user/cour-sequence/cour-sequence.component';
import { QuestionComponent } from './features/user/cours/Quiz/question/question.component';
import { RegleComponent } from './features/user/cours/Quiz/regle/regle.component';
import { ResultatComponent } from './features/user/cours/Quiz/resultat/resultat.component';
import { RegisterComponent } from './features/auth/Register/Registre.component';
import { LoginComponent } from './features/auth/login/login.component';
import {AuthGuard} from "./core/guards/auth-guard.guard";
import {AdminGuard} from "./core/guards/admin-guard.guard";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CoursesComponent,
    LoginComponent,
    FooterComponent,
    RegleComponent,
    QuestionComponent,
    ResultatComponent,
    RegisterComponent,
      CourSequenceComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SequenceComponent,
    PdfViewerModule,
    NgbModule,
    FormsModule,


  ],
  providers: [NgbModal,
  AuthGuard,
  AdminGuard
],
  bootstrap: [AppComponent]
})
export class AppModule { }
