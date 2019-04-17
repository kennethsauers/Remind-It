import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../schema/reminders';
import { EventService } from '../services/event.service';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reminder-view',
  templateUrl: './reminder-view.component.html'
})
export class ReminderViewComponent {
  repeatingFrequencies = [
    { name: "Select an option...", value: "" },
    { name: "Daily", value: "day" },
    { name: "Weekly", value: "week" },
    { name: "Monthly", value: "month" }
  ]

  openedDate: Date = new Date();

  reminderViewForm = new FormGroup({
    name: new FormControl({ value: '', disabled: true }, [
      Validators.maxLength(32)
    ]),
    description: new FormControl({ value: '', disabled: true }, [
      Validators.maxLength(32767)
    ]),
    dueDate: new FormControl({ value: '', disabled: true }, [
      Validators.maxLength(16)
    ]),
    time: new FormControl({ value: '', disabled: true }, Validators.maxLength(16)),
    isRepeating: new FormControl({ value: false, disabled: true }),
    mustBeNear: new FormControl({ value: false, disabled: true }),
    repeatUnit: new FormControl({ value: this.repeatingFrequencies[0].value, disabled: true }),
    repeatConst: new FormControl({ value: '', disabled: true })
  });


  reminderWatcher;
  reminder: Reminder;
  inEditMode: boolean = false;

  constructor(private authService: AuthenticationService,
    public eventService: EventService) {
    this.reminderWatcher = eventService.onEventLoad.subscribe({
      next: (event: Reminder) => {
        this.reminder = event;
        this.reminderViewForm.setValue({
          name: event.name,
          description: event.description,
          dueDate: {
            month: event.dueDate.getMonth() + 1,
            day: event.dueDate.getDate(),
            year: event.dueDate.getFullYear()
          },
          time: {
            hour: event.dueDate.getHours(),
            minute: event.dueDate.getMinutes(),
            second: event.dueDate.getSeconds()
          },
          isRepeating: event.repeats,
          mustBeNear: event.mustBeNear,
          repeatUnit: event.repeatUnit,
          repeatConst: event.repeatConst
        });
      }
    });
  }

  getDateFromPicker(date: any, time?: any): Date {
    if (time.hour != null)
      return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
    else
      return new Date(date.year, date.month - 1, date.day);
  }

  onSubmit() {
    const newEvent: Reminder = this.getCopy();
    // If in edit, we want to save the changes (if any) and return to read-mode
    if (this.inEditMode) {
      newEvent.isPublic = false;
      newEvent.name = this.reminderViewForm.get('name').value;
      newEvent.description = this.reminderViewForm.get('description').value;
      newEvent.dueDate = this.getDateFromPicker(this.reminderViewForm.get('dueDate').value,
        this.reminderViewForm.get('time').value);
      newEvent.repeats = this.reminderViewForm.get('isRepeating').value;
      newEvent.mustBeNear = this.reminderViewForm.get('mustBeNear').value;
      newEvent.repeatUnit = this.reminderViewForm.get('repeatUnit').value;
      newEvent.repeatConst = this.reminderViewForm.get('repeatConst').value

      this.eventService.updateEvent(this.authService.getToken(), newEvent);
      this.reminderViewForm.disable();
    } else
      this.reminderViewForm.enable();


    this.inEditMode = !this.inEditMode;
  }

  getCopy(): Reminder {
    return new Reminder(this.reminder._id, this.reminder.userID, this.reminder.isPublic, this.reminder.name,
      this.reminder.description, this.reminder.dueDate, this.reminder.repeats, this.reminder.isComplete, this.reminder.lat,
      this.reminder.lng, this.reminder.repeatUnit, this.reminder.repeatConst, this.reminder.mustBeNear);
  }
}
