# Actuition

## Project Description
Actuition is a tuition reimbursement management system. Users are able to make requests and be reimbursed accordingly based on the amount of funds that are available, approvals, and their final grade. Reimbursement amount is determined by event type:
* University Courses - 80%
* Seminars - 60%
* Cerification Preparation Classes - 75%
* Certification - 100%
* Techinical Training - 90%
* Other - 30%

 ## Technologies Used
 * React - version 16.14.2
 * AWS DynamoDB - version 2019.11.21
 * Express.js - version 4.16.1
 * TypeScript - version 4.1.3

## Features
* Users can log in/log out.
* Users can make a request.
* Users can see their requests and its status.
* Users with roles other than "Employee" can approve requests.
* Requests that are within 2 weeks are marked urgent.

### TODO
* Show pending total of reimbusement amount when filling out request form.
* Allow users to cancel their own request.
* Allow user to be able to upload a grade.
* Implement approving after grade is uploaded.


 ## Getting Started
In the terminal run these commands:
1. To clone: `git clone https://github.com/ninancode/actuition.git`
2. Install dependencies in both backend and frontend: `npm install`
3. Setup tables: `npm run setup`
4. Start up backend in backend folder: `npm run start`
5. Start up frontend in frontend folder: `npm run start`

## Usage
Usernames to log in with (roles are in parentheses)
* 101501 (Employee)
* 101502 (Direct Manager)
* 101511 (Supervisor & Direct Manager)
* 101511 (Supervisor)
* 101521 (BenCo)
* 101621 (Benco)

All passwords are `pass`. Once logged in, you can make a request, see your requests, and approve requests if you have the appropriate role.

## License
None.