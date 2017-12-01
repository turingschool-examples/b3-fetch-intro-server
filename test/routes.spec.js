const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('Palette');
      })
      .catch(error => {
        throw error;
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      });
  });
});

describe('API Routes', () => {

  before((done) => {
    database.migrate.latest()
      .then( () => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all of the students', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('project_name');
          response.body[0].project_name.should.equal('project1');
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return a 404 if the path is incorrect', (done) => {
      chai.request(server)
        .get('/api/v1/hello')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return all palettes for a specific project', (done) => {
      chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[1].should.have.property('id');
          response.body[1].id.should.equal(2);
          response.body[1].should.have.property('palette_title');
          response.body[1].palette_title.should.equal('Summer Ice');
          response.body[1].should.have.property('color_1');
          response.body[1].color_1.should.equal('#f4a644');
          response.body[1].should.have.property('color_2');
          response.body[1].color_2.should.equal('#f9914b');
          response.body[1].should.have.property('color_3');
          response.body[1].color_3.should.equal('#f47b52');
          response.body[1].should.have.property('color_4');
          response.body[1].color_4.should.equal('#f25e5e');
          response.body[1].should.have.property('color_5');
          response.body[1].color_5.should.equal('#f64863');
          response.body[1].should.have.property('project_id');
          response.body[1].project_id.should.equal(1);
          response.body[1].should.have.property('created_at');
          response.body[1].should.have.property('updated_at');
          done();
        })
        .catch((error) => {
          throw error;
        });
    });

    it('should return a 404 if the path is incorrect', (done) => {
      chai.request(server)
        .get('/api/v1/projects/1/hello')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });

  });

  describe('POST /api/v1/projects', () => {

    it('should be able to add a project to database', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 2,
          project_name: 'project2'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
          chai.request(server)
            .get('/api/v1/projects')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(2);
              done();
            });
        });
    });

    it('should not create a project with missing data', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 2
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });

  });

  describe('POST /api/v1/projects/:id/palettes', () => {

    it('should be able to add a project to database', (done) => {
      chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          palette_title: 'Hot Summer',
          color_1: '#f56c48',
          color_2: '#d3ab97',
          color_3: '#836777',
          color_4: '#c2dfb9',
          color_5: '#20908e',
          project_id: 1,
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          chai.request(server)
            .get('/api/v1/projects')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(1);
              done();
            });
        });
    });

    it('should not create a project with missing data', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 2
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });

  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should delete a palette from database', (done) => {
      chai.request(server)
        .delete('/api/v1/palettes/1')
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('should return a 422 error if the palette is not found', (done) => {
      chai.request(server)
        .delete('/api/v1/palettes/500')
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Not Found');
          done();
        });
    });

  });
  
});
