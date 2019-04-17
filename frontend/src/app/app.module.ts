// modules
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

// components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserpageComponent } from './userpage/userpage.component';
import { EventsComponent } from './events/events.component';
import { RemindersComponent } from './reminders/reminders.component';
import { CreateReminderComponent } from './create-reminder/create-reminder.component';
import { ReminderViewComponent } from './reminder-view/reminder-view.component';
import { EventViewComponent } from './event-view/event-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AboutComponent,
    NavbarComponent,
    UserpageComponent,
    EventsComponent,
    RemindersComponent,
    CreateReminderComponent,
    ReminderViewComponent,
    EventViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQzUboHkHzo38EDaJBpP_etZo2uOiS4r4'
    }),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CreateReminderComponent]
})
export class AppModule { }
