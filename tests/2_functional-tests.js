/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const mongoose = require('mongoose');
const Issue = require('../models/issue.js');

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  beforeEach(done => {
    Issue.deleteMany({}, err => {
      done();
    });
  });

  suite('POST /api/issues/{project} => object with issue data', function() {
    test('Every field filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test('Required fields filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test('Missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        })
        .end(function(err, res) {
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  suite('PUT /api/issues/{project} => text', function() {
    test('No body', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body, 'could not update undefined');
          done();
        });
    });

    test('One field to update', function(done) {
      const issue = new Issue({
        project: 'test',
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
      });
      issue.save((error, issue) => {
        if (error) return console.log(error);
        chai
          .request(server)
          .put('/api/issues/test')
          .send({ _id: issue._id, issue_title: 'Test Update' })
          .end(function(err, res) {
            expect(res).to.have.status(200);
            assert.equal(res.body, 'successfully updated');
            done();
          });
      });
    });

    test('Multiple fields to update', function(done) {
      const issue = new Issue({
        project: 'test',
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
      });
      issue.save((error, issue) => {
        if (error) return console.log(error);
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: issue._id,
            issue_title: 'Test',
            issue_text: 'text test',
            created_by: 'Functional Test - Multiple fields to update',
            assigned_to: 'Testing',
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'successfully updated');
            done();
          });
      });
    });
  });

  suite(
    'GET /api/issues/{project} => Array of objects with issue data',
    function() {
      test('No filter', function(done) {
        const issue = new Issue({
          project: 'test',
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        });
        issue.save((error, issue) => {
          if (error) return console.log(error);
          chai
            .request(server)
            .get('/api/issues/test')
            .query({})
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], 'issue_title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'created_by');
              assert.property(res.body[0], 'assigned_to');
              assert.property(res.body[0], 'open');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              done();
            });
        });
      });

      test('One filter', function(done) {
        const issue = new Issue({
          project: 'test',
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        });
        issue.save((error, issue) => {
          if (error) return console.log(error);
          chai
            .request(server)
            .get('/api/issues/test')
            .query({ open: true })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], 'issue_title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'created_by');
              assert.property(res.body[0], 'assigned_to');
              assert.property(res.body[0], 'open');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              done();
            });
        });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        const issue = new Issue({
          project: 'test',
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        });
        issue.save((error, issue) => {
          if (error) return console.log(error);
          chai
            .request(server)
            .get('/api/issues/test')
            .query({
              open: true,
              issue_title: 'Title',
              issue_text: 'text',
              created_by: 'Functional Test - Every field filled in',
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], 'issue_title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'created_by');
              assert.property(res.body[0], 'assigned_to');
              assert.property(res.body[0], 'open');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              done();
            });
        });
      });
    }
  );

  suite('DELETE /api/issues/{project} => text', function() {
    test('No _id', function(done) {
      const issue = new Issue({
        project: 'test',
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
      });
      issue.save((error, issue) => {
        if (error) return console.log(error);
        chai
          .request(server)
          .delete('/api/issues/test')
          .send()
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.body, '_id error');
            done();
          });
      });
    });

    test('Valid _id', function(done) {
      const issue = new Issue({
        project: 'test',
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA',
      });
      issue.save((error, issue) => {
        if (error) return console.log(error);
        chai
          .request(server)
          .delete('/api/issues/test')
          .send({ _id: issue._id })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'success: deleted ' + issue._id);
            done();
          });
      });
    });
  });
});
