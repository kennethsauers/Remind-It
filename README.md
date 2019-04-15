# Remind-It
A reminder app utilized gps services build for students with busy lives.
## Team
* Kenneth Sauers, Project Manager
* Misty Au, Project Documentation
* José Luis, Full Stack Development
* Kyle Reid, Front End Development
* Christopher Dowlatram, Front End Development & Mobile Development
* Mykola Maslych, Mobile Development & Web Deployment
* Jorge Nuñez, API Development & Databasing
## Technology used
* MongoDB
* Node.js
* Express.js
* Mongoose
* BCrypt
* Passport.js
* Angular
* Bootstrap
## Images
--  TODO ADD IMAGES  --
## Installation
----------------------------------
SETTING UP YOUR WORKSPACE IN WIN10
----------------------------------

The following are required for your Windows development environment:

  * Windows 10
  * A browser (Google Chrome, Mozilla Firefox, Microsoft Edge)
  * A text editor (Notepad++, Sublime, Atom)
  * GitHub Desktop (or a Git shell if you wanna be that guy)
  * A REST client for API testing (ARC, Postman, Soap UI)
    - NOTE: You can install ARC as a Google Chrome extension.
  * Android Studio
  * Windows Linux Subsystem
    - Node Package Manager
    - Node.js
    - MongoDB


---------------------------------------------------
RUNNING THE SERVER IN ITS DEVELOPMENT CONFIGURATION
---------------------------------------------------

To run the API, navigate to the root Remind-It directory with a Linux shell
and type:

  nodemon

To compile the front end, navigate to the Remind-It/frontend directory with a
second Linux shell and type:

  ng serve

You can then access the API using your REST client at port 3000, and you can
access the website itself from port 4200. For local development purposes,
we use HTTP and access the website through localhost.


---------------------------------------------------------------
CHANGING THE LINUX SHELL HOME DIRECTORY TO YOUR WINDOWS DESKTOP
---------------------------------------------------------------

After you open up the Windows Linux Subsystem shell, type:

  sudo nano /etc/passwd

Go all the way to the bottom where you username is. Where it says:

  /home/<your_username>
  // as an example, mine is "/home/jbn"

Change it to:

  /mnt/c/users/<your_username>/desktop
  // as an example, mine becomes "/mnt/c/users/jbn/desktop"

Then restart your Linux shell and you'll be in your Windows filesystem
instead, but you can still run all the Linux commands from there.

To check which directory you're currently in, type:

  pwd

"Pwd" stands for "print working directory". It should output:

  /mnt/c/users/<your_username>/desktop

Done!
