import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Reminder } from '../schema/reminders';
import { AuthenticationService } from '../services/authentication.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  eventViewForm = new FormGroup({
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
  event: Reminder;

  constructor(private authService: AuthenticationService,
    public eventService: EventService) {
    this.reminderWatcher = eventService.onEventLoad.subscribe({
      next: (event: Reminder) => {
        this.event = event;
        this.eventViewForm.setValue({ name: event.name, description: event.description });
      }
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    
  }

}
