# Wattle Backend
[![Build Status](https://travis-ci.org/grello-project/grello-backend.svg?branch=staging)](https://travis-ci.org/grello-project/grello-backend)

[Gitbook version of this documentation](https://wattle.gitbooks.io/wattle/content/)

An app that helps users easily organize and track tasks assigned to them in Google docs. Through OAuth, users are able to login using their Google credentials and have their assigned tasks populated into an uncategorized bucket. Users can then create new buckets with personalized categories, and drag and drop tasks into the appropriate buckets for easy organization.

[Models](#models) | [OAuth](#oauth) | [Routes](#routes) | [Testing Framework](#testing-framework) | [The Wattle Team](#the-wattle-team)

---

# Models

###### and their relationships
![Models](https://cloud.githubusercontent.com/assets/13214336/25210560/52efe59e-2535-11e7-834a-ca1e843aa289.png)

---

# OAUTH


> The authorization sequence begins when your application redirects a browser to a Google URL; the URL includes query parameters that indicate the type of access being requested. Google handles the user authentication, session selection, and user consent.
>
> The result is an access token, which the client should validate before including it in a Google API request. When the token expires, the application repeats the process<sup>1</sup>

![OAuth](https://cloud.githubusercontent.com/assets/13214336/25210628/a6f07758-2535-11e7-9143-5a6c7def2c6e.png)

###### 1. [OAuth Documentation](https://developers.google.com/identity/protocols/OAuth2)
___

# Routes

[User](#user) | [Category](#category) | [Document](#document) | [Tasks](#tasks) | [Tags](#tags) | [Error Response](#error-response)
___
### **User**

#### GET api/users

**This route allows users to gain access to the app. Using OAuth, users sign in using their unique google sign-in credentials to gain access to the app**

Expected Header:

```
"Content-Type": "application/json"
```

Example Response:

```
{
  "_id": "58f57a0774628d03a8def07c",
  "googleID": "107174370104406884799",
  "name": "Carolina",
  "email": "cejac10@gmail.com",
  "profilePic": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
  "accessToken": null,
  "refreshToken": null,
  "tokenTTL": 3600,
  "tokenTimestamp": null,
  "expiration": 1492486167.093,
  "__v": 0
}
```

#### DELETE api/users

**This route allows an authenticated user to delete their profile from the app. Upon success no body will be returned**

Expected Header:

```
"Authorization": "Bearer <token>"
```

---

### **Category**

#### POST api/categories

**This route allows users to create new category buckets for easier organization of tasks. All tasks are initially placed in an 'uncategorized' category, and then can be dragged/dropped into newly made category buckets.**

Expected Headers:

```
"Content-Type": "application/json"
"Authorization": "Bearer <token>"
```

Expected Body:

```
{
    "name": "<sring>",
    "user": "user id"
}
```

Expected Response:

```
{
  "__v": 0,
  "name": "Today",
  "user": "58f5a7cdc0fc830554454e9b",
  "_id": "58f5a99abf992807e74929c2"
}
```

#### GET api/categories

**This route will retrieve the user's existing categories**

Expected Headers:

```
"Authorization": "Bearer <token>"
```

Expected Response:

```
[
  {
    "_id": "58f5a7cdc0fc830554454e9c",
    "name": "uncategorized",
    "user": "58f5a7cdc0fc830554454e9b",
    "__v": 0
  },
  {
    "_id": "58f5ac2bbf992807e74929c4",
    "name": "Today",
    "user": "58f5a7cdc0fc830554454e9b",
    "__v": 0
  }
]
```

#### PUT api/categories/:id

**This route allows the user to update the name of existing category buckets**

Expected Headers:

```
"Authorization": "Bearer <token>"
```

Expected Body:

```
{
    "name": "<string>",
}
```

Expected Response:

```
[
  {
    "_id": "58f5a7cdc0fc830554454e9c",
    "name": "uncategorized",
    "user": "58f5a7cdc0fc830554454e9b",
    "__v": 0
  },
  {
    "_id": "58f5ac2bbf992807e74929c4",
    "name": "Tomorrow",
    "user": "58f5a7cdc0fc830554454e9b",
    "__v": 0
  }
]
```

#### DELETE api/categories/:id

**This route allows users to delete an existing category bucket. Upon success, no body will be returned**

Expected Headers:

```
"Authorization": "Bearer <token>"
```
---
### **Document**

#### GET api/documents

**This route grabs the documents from the user's Google docs drive, and returns the data onto the page.**

Expected Header:

```
"Authorization": "Bearer <token>"
```

Expected Response:

```
[
  {
    "_id": "58f5a7cdc0fc830554454e9e",
    "googleID": "1ep8bQ6ZjB68EsYqmo2wdSworXKxlSWwwalfXrgOe-lw",
    "name": "Project",
    "user": "58f5a7cdc0fc830554454e9b",
    "link": "<document link>",
    "__v": 0
  }
]
```

---

### **Tasks**

#### GET api/tasks

**This route retrieves tasks assigned to the user to populate onto their profile.**

Expected Headers:

```
"Authorization": "Bearer <token>"
```

Expected Response:

```
[
  {
    "_id": "58f5a7cdc0fc830554454e9d",
    "googleID": "7b8df6e1-9ecf-4096-9e35-e35133e23c74",
    "author": "system",
    "category": {
      "_id": "58f5a7cdc0fc830554454e9c",
      "name": "uncategorized",
      "user": "58f5a7cdc0fc830554454e9b",
      "__v": 0
    },
    "userID": "58f5a7cdc0fc830554454e9b",
    "comment": "placeholder",
    "__v": 0,
    "replies": []
  },
  {
    "_id": "58f5a99abf992807e74929c3",
    "googleID": "75afd317-f13a-43aa-84b7-62dea1e0550a",
    "author": "system",
    "category": {
      "_id": "58f5a99abf992807e74929c2",
      "name": "Friday",
      "user": "58f57a0774628d03a8def07c",
      "__v": 0
    },
    "userID": "58f5a7cdc0fc830554454e9b",
    "comment": "placeholder",
    "__v": 0,
    "replies": []
  }
]
```

---

### **Tags**

#### POST api/tags

**This route allows users to tag their tasks to fit their needs and even further organize their tasks**

Expected Headers:

```
"Content-Type": "application/json"
"Authorization": "Bearer <token>"
```

Expected Body:

```
{
    "name": "<string>",
    "user": "<user id>"
}
```

Expected Response:

```
{
  "__v": 0,
  "name": "High",
  "user": "58ea7c938091afefeb5e4080",
  "_id": "58f6fedf9c37e70f42df9059"
}
```

### GET api/tags

**This route returns all tags created on a user's account**

Expected Headers:

```
"Authorization": "Bearer <token>"
```

Expected Response:

```
[
  {
    "_id": "58f6fedf9c37e70f42df9059",
    "name": "High",
    "user": "58ea7c938091afefeb5e4080",
    "__v": 0
  }
]
```

#### PUT api/tags/:id

**This route allows the user to update the name of an existing tag**

Expected Headers:

```
"Content-Type": "application/json"
"Authorization": "Bearer <token>"
```

Expected Body:

```
{
    "name": "<string>"
}
```

Expected Response:

```
{
  "_id": "58f6fedf9c37e70f42df9059",
  "name": "Low",
  "user": "58ea7c938091afefeb5e4080",
  "__v": 0
}
```

#### DELETE api/tags/:id

**This route allows a user to delete existing tags from their profile. Upon success no body will be returned.**

Expected Headers:

```
"Authorization": "Bearer <token>"
```

---

### **Error Response**

##### 200 - Success

##### 204 - No Content \(Delete route was successful\)

##### 400 - Bad Request

##### 401 - Not Authorized

##### 404 - Not Found

##### 500 - Internal Server Error

---

# Testing Framework
- Mocha
- Chai (Expect)
- Eslint
- Travis
- Coveralls

---

# The Wattle Team:

| Ron Dunphy | Kyle Winckler | Carolina Ceja | Dan Peters | Jessica Vasquez-Soltero |
| :--- | :--- | :--- | :--- | :--- |
| [![](https://cloud.githubusercontent.com/assets/15117936/24783972/64cebe56-1b04-11e7-9356-6bac7d0291f7.png "ron")](https://cloud.githubusercontent.com/assets/15117936/24783972/64cebe56-1b04-11e7-9356-6bac7d0291f7.png) | [![](https://cloud.githubusercontent.com/assets/15117936/24783967/5a76c78c-1b04-11e7-9952-006769c44db0.png "kyle")](https://cloud.githubusercontent.com/assets/15117936/24783967/5a76c78c-1b04-11e7-9952-006769c44db0.png) | [![](https://cloud.githubusercontent.com/assets/15117936/24783952/46ca6d88-1b04-11e7-80e5-e08710f8ed08.png "carolina")](https://cloud.githubusercontent.com/assets/15117936/24783952/46ca6d88-1b04-11e7-80e5-e08710f8ed08.png) | [![](https://cloud.githubusercontent.com/assets/15117936/24783980/7417e1da-1b04-11e7-872d-5966a99a326d.png "dan")](https://cloud.githubusercontent.com/assets/15117936/24783980/7417e1da-1b04-11e7-872d-5966a99a326d.png) | [![](https://cloud.githubusercontent.com/assets/15117936/24783910/14cc8c44-1b04-11e7-90ff-d4f059799db3.png "jessica")](https://cloud.githubusercontent.com/assets/15117936/24783910/14cc8c44-1b04-11e7-90ff-d4f059799db3.png) |
