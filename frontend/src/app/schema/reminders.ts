
/**
 * Class that will hold the Reminder data once one is created.
 * This information will be sent to the API and stored.
 */
export class CreateReminderInformation {
    userId: String;
    userName: String;
    name: String;
    description: String;
    isPublic: Boolean;
    repeats: Boolean;
    dueDate: Date;
    lat?: Number;
    lng?: Number;
    completionMethod?: String
}

export class CreateReminderResponse {
    success: Boolean;
    msg: String;
    // Not sure what is the appropriate response,
    // maybe some event data so we can confirm insertion and display it?
    eventId?: String;
    event?: any;
}