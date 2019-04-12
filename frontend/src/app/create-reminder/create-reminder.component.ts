import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CreateReminderInformation, CreateReminderResponse } from '../schema/reminders';
import { AuthenticationService } from '../services/authentication.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-create-reminder',
  templateUrl: './create-reminder.component.html',
  styleUrls: ['./create-reminder.component.css']
})
export class CreateReminderComponent implements OnInit {
  createReminderForm = new FormGroup({
    name: new FormControl('birthday party my dude', [
      Validators.required,
      Validators.maxLength(32)
    ]),
    description: new FormControl('call your friends', [
      Validators.required,
      Validators.maxLength(32767)
    ]),
    isPublic: new FormControl(false),
    isRepeating: new FormControl(false)
  });

  constructor(private authService: AuthenticationService,
              private eventService: EventService,
              private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    const reminderInformation: CreateReminderInformation = {
      userId: this.authService.getUser().id,
      userName: this.authService.getUser().username,
      isPublic: this.createReminderForm.get('isPublic').value,
      repeats: this.createReminderForm.get('isRepeating').value,
      name: this.createReminderForm.get('name').value,
      description: this.createReminderForm.get('description').value,
      dueDate: new Date()
    };
    console.log(reminderInformation);

    this.eventService.addReminder(this.authService.getToken(), reminderInformation).subscribe( (res: CreateReminderResponse) => {
      if (res.success) {
        console.log('created event! heres the entire event object for whatever ', res.event)
      } else {
        console.log("failed to create event: ", res.msg);
      }
    });
  }
}
