/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const Issue = require('../models/issue.js');

module.exports = (app, db) => {
  app
    .route('/api/issues/:project')

    .get((req, res) => {
      const project = req.params.project;
      const filters = { ...req.body, project: project };

      Issue.find(filters, (error, issues) => {
        if (error) {
          return res.status(400).json({ error: error.message });
        }
        return res.json(issues);
      });
    })

    .post((req, res) => {
      //Add project to req.body
      req.body.project = req.params.project;
      const issue = new Issue(req.body);

      issue.save((error, issue) => {
        if (error) {
          return res.status(400).json({ error: error.message });
        }

        return res.json(issue);
      });
    })
    .put((req, res) => {
      const project = req.params.project;
      const id = req.body._id;
      const issueUpdated = { ...req.body, updated_on: new Date() };

      //Remove properties with empty strings from issueUpdated
      Object.keys(issueUpdated).forEach(
        key => issueUpdated[key] == '' && delete issueUpdated[key]
      );

      Issue.updateOne(
        { project: project, _id: id },
        issueUpdated,
        (error, issue) => {
          if (error) {
            return res.status(400).json('could not update ' + id);
          }

          if (issue.n !== 0) {
            if (issue.nModified > 0) {
              return res.json('successfully updated');
            } else {
              return res.status(400).json('no updated field sent');
            }
          }
          return res.status(400).json('could not update ' + id);
        }
      );
    })
    .delete((req, res) => {
      const project = req.params.project;
      const id = req.body._id;

      if (!id) {
        return res.status(400).json('_id error');
      } else {
        Issue.deleteOne({ project: project, _id: id }, (error, result) => {
          if (error) {
            return res.status(400).json('failed: could not delete ' + id);
          }

          return res.json('success: deleted ' + id);
        });
      }
    });
};
