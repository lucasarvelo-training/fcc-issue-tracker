var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const issueSchema = new Schema({
    project: {type: String, required: 'Project is Required'},
    issue_title: { type: String, required: 'Title is Required' },
    issue_text: { type: String, required: 'Text is Required' },
    created_by: { type: String, required: 'Create by is Required' },
    assigned_to: String,
    status_text: String,
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    open: { type: Boolean, default: true },
  });

module.exports = mongoose.model('Issue', issueSchema);

