import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { EventService } from '../services/event.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { CreateReminderInformation, CreateReminderResponse } from '../schema/reminders';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  repeatingFrequencies = [
    { name: "Select an option...", value: "" },
    { name: "Daily", value: "day" },
    { name: "Weekly", value: "week" },
    { name: "Monthly", value: "month" }
  ]
  openedDate: Date = new Date();
  createEventForm = new FormGroup({
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

  constructor(private authService: AuthenticationService,
    private eventService: EventService,
    public activeModal: NgbActiveModal,
    private router: Router) { }

  ngOnInit() {
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

  onSubmit() {
    const eventInformation: CreateReminderInformation = {
      userID: this.authService.getUser().id,
      // Reminders are private only, pls confirm
      isPublic: false,
      isComplete: false,
      name: this.createEventForm.get('name').value,
      description: this.createEventForm.get('description').value,
      dueDate: this.getDateFromPicker(this.createEventForm.get('dueDate').value,
        this.createEventForm.get('time').value),
      repeats: this.createEventForm.get('isRepeating').value,
      repeatUnit: this.createEventForm.get('repeatUnit').value,
      mustBeNear: this.createEventForm.get('mustBeNear').value,
      repeatConst: this.createEventForm.get('repeatConst').value,
      /// TODO: Add location stuff
      lat: 0,
      lng: 0,
    };

    this.eventService.addReminder(this.authService.getToken(), eventInformation).subscribe((res: CreateReminderResponse) => {
      this.success = res.success;
      this._success.next(res.msg);
      
      if(this.success) {
        this.activeModal.close(this.success);
      }
    });
  }
}
