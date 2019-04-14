export class Reminder {
    constructor(public name: string,
        public description: string,
        public dueDate: Date,
        public _id?: string,
        public userID?: string,
        public lat?: number,
        public lng?: number,
        public repeats?: boolean,
        completionMethod?: string) { }
}

/**
 * Class that will hold the Reminder data once one is created.
 * This information will be sent to the API and stored.
 */
export class CreateReminderInformation {
    userID: string;
    userName: string;
    name: string;
    description: string;
    isPublic: boolean;
    repeats: boolean;
    dueDate: Date;
    lat?: number;
    lng?: number;
    completionMethod?: string
}

export class CreateReminderResponse {
    success: boolean;
    msg: string;
    // Not sure what is the appropriate response,
    // maybe some event data so we can confirm insertion and display it?
    eventId?: string;
    event?: any;
}

export class UpdateEventResponse {
    success: boolean;
    msg?: string;
    event?: any;
}
