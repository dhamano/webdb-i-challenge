const express = require('express');
const router = express.Router();

const db = require('../data/dbConfig.js');

router.get('/', (req, res) => {
  const { limit, orderby, sortdir } = req.query;

  const query = db('accounts');

  if(limit) { query.limit(limit); };
  if(orderby && sortdir) { query.orderBy([{ column: orderby, order: sortdir }]) };
  if(orderby) {query.orderBy(orderby); };


  query
    .then( accounts => {
      res.status(200).json(accounts);
    })
    .catch( err => {
      res.status(500).json({ error: 'there was a problem getting accounts from the database' })
    })
})

router.post('/', (req, res) => {
  const account = req.body;

  if(account.name === undefined && account.budge === undefined) {
    return res.status(400).json({ message: 'Account name and budget required' });
  }
  if( account.name === undefined || account.name.trim() === '') {
    return res.status(400).json({ message: 'Account name is required' });
  }
  if( account.budget === undefined ) {
    return res.status(400).json({ message: 'Account budget is required' });
  }

  db('accounts')
    .insert(account, 'id')
    .then( account => {
      res.status(200).json(account);
    })
    .catch( err => {
      res.status(409).json({ error: 'Name already exists' });
    })
})


router.put('/:id', (req, res) => {
  const changes = req.body;
  const id = parseInt(req.params.id);
  console.log('id', id)
  if( changes.name === undefined && changes.budget === undefined) {
    res.status(400).json({ message: 'You must have a name or a budget to update' })
  }
  if( changes.name.trim() === '') {
    return res.status(400).json({ message: 'Account name is required' });
  }
  if( id === undefined ) {
    return res.status(400).json({ message: 'id of account required' });
  }
  db('accounts')
    .where('id', '=', id)
    .update(changes)
    .then( count => {
      if(count) {
        res.status(200).json({ message: `${count} record(s) have been updated` });
      } else {
        res.status(404).json({ message: 'the account you are trying to update does not exits' });
      }
    })
    .catch( err => {
      res.status(500).json({ error: 'There was an error updating the database' })
    })
})

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if( id === undefined ) {
    return res.status(400).json({ message: 'id of account required' });
  }
  db('accounts')
    .where('id', '=', id)
    .del()
    .then( count => {
      if(count) {
        res.status(200).json({ message: `${count} record(s) has been deleted` });
      } else {
        res.status(404).json({ message: 'the account you are trying to delete does not exits' });
      }
    })
    .catch( err => {
      res.status(500).json({ error: 'There was an error deleteing the account from the database' })
    })
})

module.exports = router;