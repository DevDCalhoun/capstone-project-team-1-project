This is the technical guide. For the practical running of the application, view the video at this link after getting everything set up from the instructions in this document: https://www.youtube.com/watch?v=lnolLPuVJVQ&ab_channel=DarylCalhoun

This guide goes over setting up and running the project. A youtube video has been created to demonstrate how to use the application in a practical manner from a user's functional viewpoint.

This guide covers the basic information for the project as well as setting it up and getting it running.

There is currently no direct administrative interface for admins. If you want to make changes or manage the project you will need all the programs/dependancies mentioned below and handle the code base and database directly.

For an overview of the files in this project, please view the README within this project.

Basic information
App Name: DisrupTutor
Features:
  1. Creatiion of user and tutor accounts
  2. Creating appointments between a regular user and a tutor user
  3. Customizing and managing profile
  4. Managing and viewing appointments for users and tutors
  5. Search functionality for student users to find tutors

############################################################

Setting up  and running the project:
  1. Download and installe node.js and node package manager from https://nodejs.org/

  2. Register for MongoDB Atlas at: https://www.mongodb.com/cloud/atlas

  3. Install mongodb at: https://www.mongodb.com/docs/manual/installation/

  4. Open your terminal or command prompt and navigate to your desired directory to keep the project

  5. Clone the Github repository if necessary using this command: git clone https://github.com/uwf-capstone-fa2024/capstone-project-team-1-project.git

  6. Navigate to the project directory and use the command: npm install

  7. Before running the application be sure to seed users into the database using this command from the top directory of the project: node seedingDB/seedUsers.js

  8. The above command will seed users into the database

  9. To start the application use the command: nodemon server.js

  10. The previous command will default to port 3000

  11. To go to the web page go to:  http://localhost:3000

  12. If you would like to run the application on another port at the same time to test tutor and student functionality side-by-side the command is: PORT=3001 nodemon server.js

  13. You can replace the PORT above with any other desired port

  ############################################################

  Troubleshooting/FAQ
 -------------------------
    Q: My seeded users are not showing up in the database properly as tutors with availability. Why is that?

    A: There is sometimes a bug where the users are not seeded properly due to database issues. If this occurs, delete your current database and session data from MongoDB and reseed the users. This is a rare occurence and a fix has yet to be found aside from reseeding the database.
-------------------------
    Q: I cannot run the application properly, what do I do?

    A: Ensure that you pulled the correct branch, the most up to date being the main branch. Ensure that you have installed node, node package manager, and that you installed the node dependancies in the steps above, and ensure that you have MongoDB installed.

-------------------------

    Q: Seeding my database with users does not work properly, what do I do?
    A: Ensure that you have MongoDB installed prperly for your particular system and then attempt to seed users again

-------------------------

    Q: I cannot start the server using nodemon, what do I do?
    A: After running the command "npm i" from the command line within the project directory, nodemon should work, but if not then you should run this command again: npm i -g nodemon

    The previous command will ensure that nodemon is installed globally and should fix the issue.
