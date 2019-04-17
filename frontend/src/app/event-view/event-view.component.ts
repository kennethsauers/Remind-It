import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Reminder } from '../schema/reminders';
import { AuthenticationService } from '../services/authentication.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html'
})
export class EventViewComponent {
  repeatingFrequencies = [
    { name: "Select an option...", value: "" },
    { name: "Daily", value: "day" },
    { name: "Weekly", value: "week" },
    { name: "Monthly", value: "month" }
  ]

  openedDate: Date = new Date();

  eventViewForm = new FormGroup({
    name: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.maxLength(32)
    ]),
    description: new FormControl({ value: '', disabled: true }, [
      Validators.required,
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

  eventWatcher;
  event: Reminder = null;
  inEditMode: boolean = false;

  constructor(private authService: AuthenticationService,
    public eventService: EventService) {
    this.eventWatcher = eventService.onEventLoad.subscribe({
      next: (event: Reminder) => {
        this.event = event;
        this.eventViewForm.setValue({
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
      newEvent.isPublic = true;
      newEvent.name = this.eventViewForm.get('name').value;
      newEvent.description = this.eventViewForm.get('description').value;
      newEvent.dueDate = this.getDateFromPicker(this.eventViewForm.get('dueDate').value,
        this.eventViewForm.get('time').value);
      newEvent.repeats = this.eventViewForm.get('isRepeating').value;
      newEvent.mustBeNear = this.eventViewForm.get('mustBeNear').value;
      newEvent.repeatUnit = this.eventViewForm.get('repeatUnit').value;
      newEvent.repeatConst = this.eventViewForm.get('repeatConst').value

      this.eventService.updateEvent(this.authService.getToken(), newEvent);
      this.eventViewForm.disable();
    } else
      this.eventViewForm.enable();


    this.inEditMode = !this.inEditMode;
  }

  getCopy(): Reminder {
    return new Reminder(this.event._id, this.event.userID, this.event.isPublic, this.event.name,
      this.event.description, this.event.dueDate, this.event.repeats, this.event.isComplete, this.event.lat,
      this.event.lng, this.event.repeatUnit, this.event.repeatConst, this.event.mustBeNear);
  }

}
