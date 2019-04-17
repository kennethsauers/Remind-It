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
    this.eventViewForm.disable();
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
}
