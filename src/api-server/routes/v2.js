'use strict';

const fs = require('fs');
const express = require('express');
const Collection = require('../models/data-collection.js');

const bearerAuth = require('../../auth/middleware/bearer.js')
const permissions = require('../../auth/middleware/acl.js')

const router = express.Router();

const models = new Map();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next("Invalid Model");
    }
  }
});

router.get('/:model', bearerAuth, handleGetAll);
router.get('/:model/:id',bearerAuth, handleGetOne);
router.post('/:model', bearerAuth, permissions('create'),  handleCreate);
router.put('/:model/:id', bearerAuth, permissions('update'),  handleUpdate);
router.patch('/:model/:id', bearerAuth, permissions('update'),  handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  try {
    let theRecord = await req.model.get(id);
    res.status(200).json(theRecord);
  } catch (error) {
    error.message = 'ID doesn\'t exist';
    res.status(500).json(error.message);
  }
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  try {
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } catch (error) {
    error.message = 'ID doesn\'t exist';
    res.status(500).json(error.message);
  }
}

async function handleDelete(req, res) {
  let id = req.params.id;
  try {
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (error) {
    error.message = 'ID doesn\'t exist';
    res.status(500).json(error.message);
  }
}

module.exports = router;