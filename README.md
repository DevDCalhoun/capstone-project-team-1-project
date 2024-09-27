# *D*isrup*T*utor

![Logo](images/DisrupTutorLogo-192px.png)

#### DisrupTutor is a web application that allows students to find and schedule tutors from the Multipurpose Lab (MPL) at the University of West Florida (UWF). For more information about the lab, visit the [MPL](https://uwf.edu/hmcse/departments/computer-science/about-us/facilities/multiplatform-lab/) website.

![Version](https://img.shields.io/badge/version-0.3-blue)
![Nodejs](https://img.shields.io/badge/node.js-v20.11.0-blue)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Docs](https://img.shields.io/badge/documentation-In%20Progress-yellow)


## Description

With the current conditions on campus at the University of West Florida, students seeking tutoring/coaching in course-related subjects are finding it increasingly difficult to obtain these services.  Since tutoring services are managed on a departmental basis, methods to schedule help can be very different, difficult to navigate, or outdated.  The aim of this project is to bring the process of tutoring scheduling in a simple web application.  Tutors can no longer waste time sitting in a lab with no students to guide.  Our web-based service provides more flexibility and connectivity between students and tutors.

#### **DISCLAIMER** - As a capstone project, this web application is not directly affliated with UWF and is currently developed for educational purposes only.  For tutoring at UWF, visit their [Tutoring Services](https://uwf.edu/go/tutoring/).

## Getting Started
### Prerequsites
To clone the repository, ensure the following software installed:
- **Node.js** (v20 or higher) – [Download Node.js](https://nodejs.org/en/download/)
- **MongoDB** – [Download MongoDB](https://www.mongodb.com/try/download/community)
- **Git** (Repository cloning) – [Download Git](https://git-scm.com/)

To verify installation, run the following terminal commands:
```bash
node -v
mongo --version
git --version
```

Clone the repository:
``` bash
git clone https://github.com/uwf-capstone-fa2024/capstone-project-team-1-project.git
```

### Installing

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

### Executing program

The running enviorment for the application is currently in development mode using nodemon
``` bash
nodemon server.js
```

## Help

Any advice for common problems or issues.
```
command to run if program contains helper info
```

## Authors

- Lead Developer: [Daryl Calhoun](dc128@students.uwf.edu)
- Developer: [Jason Barker](jb306@students.uwf.edu)

## Version History

* 0.3
    * Refactor for CRUD
    * Optimize login,register,logout routes
    * UI/UX for web pages
* 0.2
    * Added database and user schema
    * User registration
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

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
