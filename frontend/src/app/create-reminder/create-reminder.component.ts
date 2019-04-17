import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { CreateReminderInformation, CreateReminderResponse } from '../schema/reminders';
import { AuthenticationService } from '../services/authentication.service';
import { EventService } from '../services/event.service';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-reminder',
  templateUrl: './create-reminder.component.html',
  styleUrls: ['./create-reminder.component.css']
})
export class CreateReminderComponent  {
  repeatingFrequencies = [
    { name: "Select an option...", value: "" },
    { name: "Daily", value: "day" },
    { name: "Weekly", value: "week" },
    { name: "Monthly", value: "month" }
  ]

  openedDate: Date = new Date();
  createReminderForm = new FormGroup({
    newReminderName: new FormControl('', [
      Validators.required,
      Validators.maxLength(32)
    ]),
    newReminderDescription: new FormControl('', [
      Validators.required,
      Validators.maxLength(32767)
    ]),
    newReminderDueDate: new FormControl({ month: this.openedDate.getMonth() + 1, day: this.openedDate.getDate(), year: this.openedDate.getFullYear() }, [
      Validators.required,
      Validators.maxLength(16)
    ]),
    newReminderTime: new FormControl({ hour: this.openedDate.getHours(), minute: this.openedDate.getMinutes(), second: 0 }, Validators.maxLength(16)),
    newReminderisRepeating: new FormControl(false),
    newReminderMustBeNear: new FormControl(false),
    newReminderRepeatUnit: new FormControl(this.repeatingFrequencies[0].value),
    newReminderRepeatConst: new FormControl(1)
  });

  private _success = new Subject<string>();
  madeReminder: boolean;
  createResponseMessage: string;

  newReminderLatitude: Number;
  newReminderLongitude: Number;
  userLatitude: Number;
  userLongitude: Number;

  constructor(private authService: AuthenticationService,
    private eventService: EventService,
    public activeModal: NgbActiveModal,
    private router: Router) {
      this.authService.fetchLastLocation();
      this.authService.isLocationDataValid.asObservable().subscribe((success) => {
        if (success) {
        this.userLatitude = this.authService.lastLocation.coords.latitude;
        this.userLongitude = this.authService.lastLocation.coords.longitude;
        }
      });
      if (this.authService.lastLocation == null) {
        this.newReminderLatitude = 28.6024274;
        this.newReminderLongitude = -81.2000599;
      } else {
        this.newReminderLatitude = this.authService.lastLocation.coords.latitude;
        this.newReminderLongitude = this.authService.lastLocation.coords.longitude;
      }
      this._success.subscribe((msg) => { this.createResponseMessage = msg });
      this._success.pipe(
        debounceTime(5000)
      ).subscribe(() => this.madeReminder = null);
     }
  getDateFromPicker(date: any, time?: any): Date {
    if (time.hour != null)
      return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
    else
      return new Date(date.year, date.month - 1, date.day);
  }

  mapClicked($event: MouseEvent) {
    this.newReminderLatitude = +$event.coords.lat;
    this.newReminderLongitude = +$event.coords.lng;
  }

  createReminder() {
    const reminderInformation: CreateReminderInformation = {
      userID: this.authService.getUser().id,
      // Reminders are private only, pls confirm
      isPublic: false,
      isComplete: false,
      name: this.createReminderForm.get('newReminderName').value,
      description: this.createReminderForm.get('newReminderDescription').value,
      dueDate: this.getDateFromPicker(this.createReminderForm.get('newReminderDueDate').value,
        this.createReminderForm.get('newReminderTime').value),
      repeats: this.createReminderForm.get('newReminderisRepeating').value,
      repeatUnit: this.createReminderForm.get('newReminderRepeatUnit').value,
      mustBeNear: this.createReminderForm.get('newReminderMustBeNear').value,
      repeatConst: this.createReminderForm.get('newReminderRepeatConst').value,
      lat: +this.newReminderLatitude,
      lng: +this.newReminderLongitude,
    };

    this.eventService.addReminder(this.authService.getToken(), reminderInformation).subscribe((res: CreateReminderResponse) => {
      this.madeReminder = res.success;
      this._success.next(res.msg);

      if(this.madeReminder) {
        this.activeModal.close(this.madeReminder);
      }
    });
  }
}
