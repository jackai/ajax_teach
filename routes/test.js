var express = require('express');
var createError = require('http-errors');
var { promisePool: mysql } = require('../lib/mysql');
var router = express.Router();

router.get('/', async function(req, res, next) {
  const [rows,fields] = await mysql.execute('SELECT * FROM test');
  res.render('test/index', { 
    rows,
    title: 'Test',
    row: req.query.row ?? 10,
    col: req.query.col ?? 10,
  });
});

router.get('/edit', async function(req, res, next) {
  const id = req.query.id;

  if (!id) {
    return next(createError(404, 'id不存在'));
  }

  const [rows,fields] = await mysql.execute('SELECT * FROM test WHERE id = ?', [id]);
  
  res.render('test/edit', {
    data: rows[0],
    title: 'Test',
  });
});

router.post('/save', async function(req, res, next) {
  const id = req.query.id;
  const { c1, c2 } = req.body;

  if (!id) {
    const [rows,fields] = await mysql.execute('INSERT INTO test (c1, c2) VALUES (?, ?)', [c1, c2]);
  }

  const [rows,fields] = await mysql.execute('UPDATE test SET c1 = ?, c2 = ? WHERE id = ?', [c1, c2, id]);
  
  res.redirect('/test');
});


router.get('/create', async function(req, res, next) {
  res.render('test/edit', { 
    data: {
      id: 0,
      c1: '',
      c2: '',
    },
    title: 'Test',
  });
});

module.exports = router;
