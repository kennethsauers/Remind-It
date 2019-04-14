import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../schema/reminders';
import { EventService } from '../services/event.service';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reminder-view',
  templateUrl: './reminder-view.component.html',
  styleUrls: ['./reminder-view.component.css']
})
export class ReminderViewComponent implements OnInit {
  reminderViewForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(32)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(32767)
    ])
  });


  reminderWatcher;
  reminder: Reminder;

  constructor(private authService: AuthenticationService,
    public eventService: EventService) {
    this.reminderWatcher = eventService.onEventLoad.subscribe({
      next: (event: Reminder) => {
        this.reminder = event;
        this.reminderViewForm.setValue({ name: event.name, description: event.description });
      }
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    
  }
}
