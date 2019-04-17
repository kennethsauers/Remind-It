export class Reminder {
    constructor(public _id: string,
        public userID: string,
        public isPublic: boolean,
        public name: string,
        public description: string,
        public dueDate: Date,
        public repeats: boolean,
        public isComplete: boolean,
        public lat?: number,
        public lng?: number,
        public repeatUnit?: string,
        public repeatConst?: number,
        public mustBeNear?: boolean) { }
}

/**
 * Class that will hold the Reminder data once one is created.
 * This information will be sent to the API and stored.
 */
export class CreateReminderInformation {
    userID: string;
    isPublic: boolean;
    name: string;
    description: string;
    dueDate: Date;
    repeats: boolean;
    isComplete: boolean;
    lat?: number;
    lng?: number;
    repeatUnit?: string;
    repeatConst?: number;
    mustBeNear?: boolean;
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

export class DeleteReminderResponse {
  success: boolean;
  msg?: string;
}
