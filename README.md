# *D*isrup*T*utor

![Logo](public/images/DisrupTutorLogo-288px.png)

#### DisrupTutor is a web application that allows students to find and schedule tutors from the Multipurpose Lab (MPL) at the University of West Florida (UWF). For more information about the lab, visit the [MPL](https://uwf.edu/hmcse/departments/computer-science/about-us/facilities/multiplatform-lab/) website.

![Version](https://img.shields.io/badge/version-0.5-blue)
![Nodejs](https://img.shields.io/badge/node.js-v20.11.0-blue)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Docs](https://img.shields.io/badge/documentation-In%20Progress-yellow)

## Table of contents

* [Description](#description)
* [Video Demo](#video-demonstration)
* [Getting Started](#getting-started)
  + [Prerequisites](#prerequisites)
* [Installing](#installing)
  + [Node.js Dependencies](#nodejs-dependencies)
  + [Development Dependencies](#nodejs-dev-dependencies)
* [Executing program](#executing-program)
  + [Executing tests](#executing-testing)
* [Help](#help)
* [Authors](#authors)
* [Next Version](#version-04-and-higher)
* [Version History](#version-history)
* [Licenses](#license)
* [Acknowledgements](#acknowledgments)

## Description

With the current conditions on campus at the University of West Florida, students seeking tutoring/coaching in course-related subjects are finding it increasingly difficult to obtain these services.  Since tutoring services are managed on a departmental basis, methods to schedule help can be very different, difficult to navigate, or outdated.  The aim of this project is to bring the process of tutor scheduling in a simple web application.  Tutors can no longer waste time sitting in a lab with no students to guide.  Our web-based service provides more flexibility and connectivity between students and tutors.

#### **DISCLAIMER** - As a capstone project, this web application is not directly affliated with UWF and is currently developed for educational purposes only.  For tutoring at UWF, visit their [Tutoring Services](https://uwf.edu/go/tutoring/).

## Video Demonstration

The video demo is walkthrough of the web application in its current status.  Setup and installation to run the application are provided [below](#getting-started).

* [Stage 1 Demo](https://youtu.be/-i7RM1oir0A)
* [Stage 2 Demo](https://youtu.be/xvIwwKJa_Y4)


## Getting Started

The following are prerquisites to run the web application in development.

### Prerequisites

To clone the repository, ensure the following software installed:
- **Node.js** (v20 or higher) – [Download Node.js](https://nodejs.org/en/download/)
- **MongoDB** – [Download MongoDB](https://www.mongodb.com/try/download/community) 
- **MongoDB Compass** - [Download Compass](https://www.mongodb.com/products/tools/compass)
- **Git** (Repository cloning) – [Download Git](https://git-scm.com/)
- **Git for Windows** (Git BASH) - [Download Git for Windows](https://gitforwindows.org/) - For Windows Dev Environment

To verify installation, run the following terminal commands:
```bash
node -v
mongo --version
git --version
```
Create a new directory and initialize the node project:
``` bash
mkdir project_name
```
``` bash
npm init -y
```

Clone the repository:
``` bash
git clone https://github.com/uwf-capstone-fa2024/capstone-project-team-1-project.git
```

## Installing

Install the project dependencies using Node Package Manager - `npm` - within the project directory.

``` bash
npm install
```

### Node.js Dependencies

These packages will be automatically installed with [npm](https://docs.npmjs.com/):
* bcrypt: Used for securely hashing passwords.
* body-parser: Middleware for parsing incoming request bodies in JSON or URL-encoded format.
* connect-mongo: MongoDB session store for persisting session data.
* ejs: Template engine to render HTML views dynamically.
* express: The web framework for building APIs and handling routing.
* express-session: Middleware for managing user sessions in Express.
* express-validator: Middleware for validating and sanitizing input data in Express routes.
* joi: Used for validating schema objects, particularly useful for validating request payloads.
* mocha: A testing framework for running unit tests.
* mongodb: Official MongoDB driver for connecting your Node.js app to the database.
* mongoose: An ODM for MongoDB, used for managing schema-based data models.
* pino: A fast logging library for logging in JSON format, ensuring efficiency and performance.
* sinon: A testing library for Node.js applications
* jest: A testing framework for unit and integration tests
* supertest: A testing library for Node.js applications
* csurf: Provides Cross-Site Request Forgery (CSRF) protection for Express.js web applications

### Node.js Dev Dependencies

These packages are used in non-production enviornments:
* pino-pretty: `npm install pino-pretty --save-dev` - For human-readable plaintext output

## Executing program

The running enviornment for the application is currently in development mode using nodemon
``` bash
nodemon server.js
```

To output logs from the terminal in a more human-readable format, pipe pino-pretty:
```
nodmeon server.js | npx pino-pretty
```
The terminal outputs that the database is connected upon succuesful execution.  Now open a web browser an enter:
> 

### Executing testing
To run automated unit & integration tests within the test directory:
``` bash
npm test
```
Results are displayed to the terminal as pass/fail.

### Test Coverage and Security Controls
The development of this web appication is using the [OWASP Web Security Testing Guide](https://github.com/OWASP/wstg). For
test cases and security testing, see our [documentation](documentation/capstone-team1-security-controls-and-testing-stage2.docx.pdf). 

## Help

The following node commands for helper info may aid in resolving setup issues:
```
node --help
npm --help
nodemon --help
```

## Authors

- Lead Developer: [Daryl Calhoun](dc128@students.uwf.edu)
- Developer: [Jason Barker](jb306@students.uwf.edu)

GitHub repository created by:
- Instructor: [E.L. Fridge](efridge@uwf.edu)

## Version 0.6 and higher

In the project's next iteration of development, newer versions add the following functionality:

* 0.7 - 1.0:
    * Configuration & deployment
* 0.6: User features for profile pages
    * Tutor ratings
    * Tutor reviews

## Version History

*  0.5
    * CSRF tokens in web form POST requests
    * Authorization routing
    * Role-base users for 'student', 'tutor', 'admin'
    * Search criteria for tutor selection complete
*  0.4
    * Authentication routing 
    * UI/UX for search, availability, and appointment web pages
    * Appointment scheduling capabilities
    * Search available tutors 
    * Functionality for tutor availability
* 0.3
    * Refactor for CRUD
    * Optimize login,register,logout routes
    * UI/UX for web pages
    * logging http requests and new users
* 0.2
    * Added database and user schema
    * User registration & db population
    * Mocha testing framework
* 0.1
    * Initial static web page
    * Navigation Bar

## License

This project uses several open-source libraries and frameworks, each of which has its own license:

- **Bootstrap**: Licensed under the [MIT License](https://opensource.org/licenses/MIT).
- **Node.js**: Licensed under the [MIT License](https://opensource.org/licenses/MIT).
- **Express**: Licensed under the [MIT License](https://opensource.org/licenses/MIT).
- **EJS**: Licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
- **MongoDB**: Licensed under the [Server Side Public License (SSPL)](https://www.mongodb.com/licensing/server-side-public-license).

### MIT License
The MIT License is a permissive free software license, meaning that you are free 
to use, modify, and distribute the software as long as you include the original 
copyright notice.

### Apache 2.0 License
The Apache 2.0 License allows for the use, modification, and distribution of 
software, provided that you include the license text and make note of any changes 
made to the code.

### SSPL
MongoDB is licensed under the Server Side Public License (SSPL). If you modify 
MongoDB and provide it as a service, you must release your modifications as 
open-source software under the SSPL.


## Acknowledgments

Below are resouces that aided in the development of this project:
* [awesome-readme](https://github.com/matiassingers/awesome-readme) : Markdown code for README.md file
