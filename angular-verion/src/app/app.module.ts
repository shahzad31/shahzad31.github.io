import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResumeComponent } from './app/resume/resume.component';
import { WorkComponent } from './app/work/work.component';
import { ContactComponent } from './app/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    ResumeComponent,
    WorkComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
