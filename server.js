const express = require('express');
const bodyParser = require('body-parser');
//const md5 = require('md5');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('You are in Palette Picker!');
});

//get ALL projects
app.get('/api/v1/projects', (request, response) => {
  //retrieve all projects
  //if (project) { return response.status(200).json(project)}
  response.json(app.locals.projects);
});

//get a specific project
app.get('/api/v1/projects/:id', (request, response) => {
  //retrieve all projects
  const { id } = request.params;
  //find the matching project
  const project = app.locals.projects.find(project => project.id === id);
  //if (project) { return response.status(200).json(project)}
  //else return response.sendStatus(404);
});

//get palettes of a specific project
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { palette } = request.body;
  //retrieve all palettes of a specific project
});

//post all projects
app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  //create a new project
  // if (!project) {
  //return response.status(422).semd({
  //error: 'no project property provided' }
  //)};
  // else - push into array, and:
  //return response.status(201).json({ id, project})
});

//post ALL palettes
app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  //create a new palette
});

//delete a specific palette
app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  //delete that palette
  //if the user is not an id that matches:
  //  response.status(404).({ error: 'no palettes match!'})
  //if it works:
  // response.sendStatus(204)
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
