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
export class ReminderViewComponent {
  reminderViewForm = new FormGroup({
    name: new FormControl({value: '', disabled: true}, [
      Validators.required,
      Validators.maxLength(32)
    ]),
    description: new FormControl({value: '', disabled: true}, [
      Validators.required,
      Validators.maxLength(32767)
    ])
  });


  reminderWatcher;
  reminder: Reminder;
  inEditMode: boolean = false;

  constructor(private authService: AuthenticationService,
    public eventService: EventService) {
    this.reminderWatcher = eventService.onEventLoad.subscribe({
      next: (event: Reminder) => {
        this.reminder = event;
        this.reminderViewForm.setValue({ name: event.name, description: event.description });
      }
    });
  }

  onSubmit() {
    const newEvent: Reminder = this.getCopy();
    // If in edit, we want to save the changes (if any) and return to read-mode
    if (this.inEditMode) {
      newEvent.name = this.reminderViewForm.get('name').value;
      newEvent.description = this.reminderViewForm.get('description').value;

      this.eventService.updateEvent(this.authService.getToken(), newEvent);
      
      this.reminderViewForm.get('name').disable();
      this.reminderViewForm.get('description').disable();
    } else {
      this.reminderViewForm.get('name').enable();
      this.reminderViewForm.get('description').enable();
    }
    this.inEditMode = !this.inEditMode;
  }

  getCopy(): Reminder {
    return new Reminder(this.reminder.name, this.reminder.description, this.reminder.dueDate, this.reminder._id, this.reminder.userID, this.reminder.lat, this.reminder.lng, this.reminder.repeats, "")
  }
}
