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
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(32)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(32767)
    ]),
    dueDate: new FormControl({ month: this.openedDate.getMonth() + 1, day: this.openedDate.getDate(), year: this.openedDate.getFullYear() }, [
      Validators.required,
      Validators.maxLength(16)
    ]),
    time: new FormControl({ hour: this.openedDate.getHours(), minute: this.openedDate.getMinutes(), second: 0 }, Validators.maxLength(16)),
    isRepeating: new FormControl(false),
    mustBeNear: new FormControl(false),
    repeatUnit: new FormControl(this.repeatingFrequencies[0].value),
    repeatConst: new FormControl(1)
  });

  private _success = new Subject<string>();
  success: boolean;
  message: string;

  latitude: Number;
  longitude: Number;
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
        this.latitude = 28.6024274;
        this.longitude = -81.2000599;
      } else {
        this.latitude = this.authService.lastLocation.coords.latitude;
        this.longitude = this.authService.lastLocation.coords.longitude;
      }
      this._success.subscribe((msg) => { this.message = msg });
      this._success.pipe(
        debounceTime(5000)
      ).subscribe(() => this.success = null);
     }
  getDateFromPicker(date: any, time?: any): Date {
    if (time.hour != null)
      return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
    else
      return new Date(date.year, date.month - 1, date.day);
  }

  mapClicked($event: MouseEvent) {
    this.latitude = +$event.coords.lat;
    this.longitude = +$event.coords.lng;
  }

  onSubmit() {
    const reminderInformation: CreateReminderInformation = {
      userID: this.authService.getUser().id,
      // Reminders are private only, pls confirm
      isPublic: false,
      isComplete: false,
      name: this.createReminderForm.get('name').value,
      description: this.createReminderForm.get('description').value,
      dueDate: this.getDateFromPicker(this.createReminderForm.get('dueDate').value,
        this.createReminderForm.get('time').value),
      repeats: this.createReminderForm.get('isRepeating').value,
      repeatUnit: this.createReminderForm.get('repeatUnit').value,
      mustBeNear: this.createReminderForm.get('mustBeNear').value,
      repeatConst: this.createReminderForm.get('repeatConst').value,
      lat: +this.latitude,
      lng: +this.longitude,
    };

    this.eventService.addReminder(this.authService.getToken(), reminderInformation).subscribe((res: CreateReminderResponse) => {
      this.success = res.success;
      this._success.next(res.msg);

      if(this.success) {
        this.activeModal.close(this.success);
      }
    });
  }
}
