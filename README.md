
# Wattle Backend
[![Build Status](https://travis-ci.org/grello-project/grello-backend.svg?branch=staging)](https://travis-ci.org/grello-project/grello-backend)


# Introduction to the Team

<table style="width:100%">
  <tr>
    <th>Ron Dunphy</th>
    <th>Kyle Winckler</th> 
    <th>Carolina Ceja</th>
    <th>Dan Peters</th>
    <th>Jessica Vasquez-Soltero</th>
  </tr>

  <tr>
    <td><img width="102" alt="ron" src="https://cloud.githubusercontent.com/assets/15117936/24783972/64cebe56-1b04-11e7-9356-6bac7d0291f7.png"></td>
    <td><img width="90" alt="kyle" src="https://cloud.githubusercontent.com/assets/15117936/24783967/5a76c78c-1b04-11e7-9952-006769c44db0.png"></td> 
    <td><img width="100" alt="carolina" src="https://cloud.githubusercontent.com/assets/15117936/24783952/46ca6d88-1b04-11e7-80e5-e08710f8ed08.png"></td>
    <td><img width="100" alt="dan" src="https://cloud.githubusercontent.com/assets/15117936/24783980/7417e1da-1b04-11e7-872d-5966a99a326d.png"></td>
    <td><img width="100" alt="jessica" src="https://cloud.githubusercontent.com/assets/15117936/24783910/14cc8c44-1b04-11e7-90ff-d4f059799db3.png"></td>
  </tr>
</table>


          

# Project Objective

Our goal is to provide a project workflow that will easily couple tasks to the assignee and allow for those tasks to be placed into categories.  The work flows from google docs to the Wattle application where the tasks can be assigned, from an uncategorized list, to the categories that each user sets.

# Schemas Used

All data is stored using MongoDB in the Backend of our Project

-Category: The different naming conventions used for each container, whether it be
 for different project names, or to assign urgency ratings for unassigned tasks.

-Document: googleID, name, array of tasks.

-Tag: Tags will identify properties on the comment object so that we can create custom filters.

-Task: All tasks to be completed.

-User: All users that have created accounts.

# Routes

 ### GET/task

 This will bring the user to the task view, where one can see the uncategorized tasks as well as the categories created.
 ```
curl http://localhost:3000/users/task
```

 ### PUT/task

 This route will allow for updating tasks.
 ```
curl -H "Authorization: Bearer <your token>" -H "Content-type: application/json" -d '{<information you want to update>}' -X PUT http://localhost:3000/api/task
```

 ### /categories

 This route will show all categories created by the user.
 ```
curl http://localhost:3000/api/categories
```

 ### /tags

 This route will show the categories that each task is associated with.  
 ```
curl http://localhost:3000/api/tags
```

 ### /user

 The user that has signed up for the Google auth API.
 ```
curl http://localhost:3000/api/user
```

 ## OAUTH:
 The user is signed into Google already, and is using Google docs.  Next, permission is granted by the user allowing google to share their information with the Wattle app.  Then the Google OAuth API sends server code to the Wattle backend server.  The Wattle backend server then sends the code back to the OAuth API with their 'secret' included.  Then the Google OAuth API sends back an access token with the request token. Then a request, with the bearer authorization token in the header, is sent to the Google openid API, which will fetch a specific set of information about the user.  The user is then placed into the application's database, and can begin using Wattle.
 
 ![googleoauth](https://cloud.githubusercontent.com/assets/15117936/24738080/0a5ec518-1a48-11e7-88d0-f23e4ff22d75.jpg)

# Deployment

We used AWS CodeDeploy to launch the application.

![aws-logo](https://cloud.githubusercontent.com/assets/15117936/24769034/cd01ae7a-1ab9-11e7-9e3a-6ef1c4b374e7.jpeg)

# Testing

Testing was done with Karma and Jasmine.

![jasmine-and-karma](https://cloud.githubusercontent.com/assets/15117936/24769214/8d33e9e2-1aba-11e7-860c-9f645ae63606.png)


[![Coverage Status](https://coveralls.io/repos/github/grello-project/grello-backend/badge.svg?branch=staging)](https://coveralls.io/github/grello-project/grello-backend?branch=staging)

