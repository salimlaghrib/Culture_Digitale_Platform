import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {ReactiveFormsModule} from "@angular/forms";

import { HomeComponent } from './home/home.component';
import { SequenceComponent } from './sequence/sequence.component';
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatTabLink, MatTabNav} from "@angular/material/tabs";
import {NgOptimizedImage} from "@angular/common";
import {MatCard, MatCardActions, MatCardHeader, MatCardModule} from "@angular/material/card";
import { CoursesComponent } from './courses/courses.component';
import { ReaderPdfComponent } from './reader-pdf/reader-pdf.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { FooterComponent } from './footer/footer.component';

import { ModalPdfComponent } from './modal-pdf/modal-pdf.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CoursesComponent,
    ReaderPdfComponent,
    FooterComponent,
    ModalPdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabNav,
    MatTabLink,
    NgOptimizedImage,
    MatCardModule,
    MatCardHeader,
    MatCardActions,
    SequenceComponent,
    PdfViewerModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
