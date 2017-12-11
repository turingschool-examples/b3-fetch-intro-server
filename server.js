const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const app = express();

const requireHTTPS = (request, response, next) => {
  //eslint-disable-next-line eqeqeq
  if (request.header('x-forwarded-proto') != 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};

if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));

app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker!');
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json(projects);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const projectId = request.params.id;

  database('palettes').where('project_id', projectId).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(200).json([]);
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['project_name']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  database('projects').insert(project, 'id')
    .then(projectId => {
      return response.status(201).json({ id: projectId[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const projectId = request.params.id;

  for (let requiredParameter of [
    'palette_title',
    'color_1',
    'color_2',
    'color_3',
    'color_4',
    'color_5',
    'project_id']) {
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  palette = Object.assign({}, palette, { project_id: projectId });

  database('palettes').insert(palette, 'id')
    .then(palette => {
      return response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });

});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ id }).del()
    .then(palette => {
      if (palette) {
        return response.sendStatus(204);
      } else {
        return response.status(422).json({ error: 'Not Found' });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });

});

app.delete('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;

  database('projects').where({ id }).del()
    .then(project => {
      if (project) {
        return response.sendStatus(204);
      } else {
        return response.status(422).json({ error: 'Not Found' });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  /*eslint-disable no-console*/
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
