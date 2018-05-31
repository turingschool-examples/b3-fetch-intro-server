# Palette Picker

Palette Picker is a single page application that allows a user to save randomly generated color palettes to a backend built with Node.js and Express. The front end application was built using jQuery. Users are able to create new projects and palettes, as well as delete palettes from the database.

<img width="1220" alt="palette picker screenshot" src="https://user-images.githubusercontent.com/25447342/33810316-845c405c-ddc0-11e7-9343-c43606667040.png">

[Palette Picker on Heroku](https://holt-palette-picker.herokuapp.com)

## Endpoints

GET `/api/v1/projects`
GET `/api/v1/projects/:id/palettes`

POST `api/v1/projects`
POST `api/v1/projects/:id/palettes`

DELETE `api/v1/projects/:id` (all palettes associated with palette must first be deleted)
DELETE `api/v1/palettes/:id`

## Getting Started

Palette Picker was created using jQuery, Node.js and Express. To install Palette Picker locally, clone down this repository and use node or nodemon to start the server.js file, which serves a static HTML page containing the application.

```
node server.js
```

### Prerequisites

[Find out more about installing node.js](https://nodejs.org/en/download/package-manager/)

The following development dependencies are needed in your package.json in order to run the test suite.

```
  "devDependencies": {
    "chai": "^4.1.2",
    "chai-http": "git+https://github.com/chaijs/chai-http.git#3ea4524",
    "mocha": "^4.0.1"
  }
```

### Installing

Install node (see link above)

Start the server using the following bash command.

```
node server.js
```
