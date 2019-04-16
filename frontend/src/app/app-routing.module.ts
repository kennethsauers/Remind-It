import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// different pages of the website
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { UserpageComponent } from './userpage/userpage.component';
import { RemindersComponent } from './reminders/reminders.component';
import { EventsComponent } from './events/events.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'settings', component: UserpageComponent },
  { path: 'reminders', component: RemindersComponent},
  { path: 'events', component: EventsComponent },


  // redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
