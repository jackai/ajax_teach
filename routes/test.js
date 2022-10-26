var express = require('express');
var cookie = require('cookie');
var createError = require('http-errors');
var { promisePool: mysql } = require('../lib/mysql');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const [rows,fields] = await mysql.execute('SELECT * FROM test');
  res.render('test/index', { 
    rows,
    title: 'Express',
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
    title: 'Express',
  });
});

router.post('/save', async function(req, res, next) {
  const id = req.query.id;

  if (!id) {
    return next(createError(404, 'id不存在'));
  }

  const { c1, c2 } = req.body;

  const [rows,fields] = await mysql.execute('UPDATE test SET c1 = ?, c2 = ? WHERE id = ?', [c1, c2, id]);
  
  res.redirect('/test');
});

router.post('/', async function(req, res, next) {
  const { c1, c2 } = req.body;
  const [rows,fields] = await mysql.execute('INSERT INTO test (c1,c2) VALUES (?, ?)', [ c1, c2 ]);
  console.log({ rows,fields });

  res.setHeader('Set-Cookie', cookie.serialize('name', String('query.name'), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }));

  console.log({
    'cookie': cookie.serialize('foo', 'bar'),
    'cookie2': cookie.serialize('name', String('query.name'), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }),
  });

  console.log({
    q: req.query,
    p: req.params,
    b: req.body,
  });

  res
  .status(404)
  .send({
    a: 123,
    b: 'test',
  });
});

module.exports = router;
