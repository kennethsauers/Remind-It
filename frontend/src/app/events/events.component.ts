import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reminder } from '../schema/reminders';
import { EventService } from '../services/event.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  reminderWatcher;
  public reminders: Reminder[];
  selectedRow: number;
  onClickedEvent: Function;
  today: Date;
  latitude: number;
  longitude: number;
  userLatitude: Number;
  userLongitude: Number;

  constructor(private modalService: NgbModal,
    private eventService: EventService,
    private authService: AuthenticationService) {
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
    this.today = new Date();

    this.reminderWatcher = this.eventService.onEventListLoad.subscribe({
      next: (reminders: Reminder[]) => {
        this.reminders = reminders;
      }
    });

    this.onClickedEvent = (index: number) => {
      if (this.selectedRow != index) {
        this.selectedRow = index;
        this.eventService.getEventInformation(this.authService.getToken(),
          this.reminders[index]._id);
        this.latitude = this.reminders[index].lat;
        this.longitude = this.reminders[index].lng;
      }
    }
  }

  ngOnInit() {
    this.refreshData();
  }

  dateCompare(then: Date, now: Date): number {
    var a: Date = new Date(then.getFullYear(), then.getMonth(), then.getDate());
    var b: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // this is today
    if (a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear())
      return 0;
    // This was yesterday
    else if (a < b)
      return -1;
    // this is in the future
    else if (a > b)
      return 1;
  }

  getImage(index: number): string {
    const tableClass = this.getClass(index);
    if (tableClass == "table-secondary") {
      return "../../assets/images/today.png";
    } else if (tableClass == "table-warning") {
      return "../../assets/images/overdue.png";
    } else if (tableClass == "table-default") {
      return "../../assets/images/event.png";
    }
  }

  getClass(index: number): string {
    const reminder: Reminder = this.reminders[index];
    const then = new Date(reminder.dueDate)
    if (this.dateCompare(then, this.today) == 0) {
      return "table-secondary";
    } else if (this.dateCompare(then, this.today) < 0) {
      return "table-warning";
    } else if (this.dateCompare(then, this.today) > 0) {
      return "table-default"
    }
  }

  refreshData() {
    this.eventService.getPublicEvents(this.authService.getToken());
  }

  completeReminder(index: number) {
    const reminder: Reminder = this.reminders[index];
    var copyReminder: Reminder = this.getCopy(reminder);
    var distance: number = 0;

    if (reminder.mustBeNear != null && reminder.mustBeNear == true && reminder.lat != null && reminder.lng != null) {
      distance = this.findDistance(reminder.lat, this.userLatitude.valueOf(), reminder.lng, this.userLongitude.valueOf());
      if (distance <= 0.001) {
        copyReminder.isComplete = true;
        this.eventService.updateEvent(this.authService.getToken(), copyReminder, true);
        this.refreshData();
      }
    } else if (reminder.mustBeNear != null && !reminder.mustBeNear) {
      copyReminder.isComplete = true;
      this.eventService.updateEvent(this.authService.getToken(), copyReminder, true);
      this.refreshData();
    }
  }

  findDistance(x1: number, x2: number, y1: number, y2: number): number {
    const xDiff: number = x2 - x1;
    const yDiff: number = y2 - y1;
    const xSqr: number = Math.pow(xDiff, 2);
    const ySqr: number = Math.pow(yDiff, 2);
    return Math.sqrt(xSqr + ySqr);
  }

  getCopy(oldReminder: Reminder): Reminder {
    return new Reminder(oldReminder._id, oldReminder.userID, oldReminder.isPublic, oldReminder.name,
      oldReminder.description, oldReminder.dueDate, oldReminder.repeats, oldReminder.isComplete, oldReminder.lat,
      oldReminder.lng, oldReminder.repeatUnit, oldReminder.repeatConst, oldReminder.mustBeNear);
  }
}