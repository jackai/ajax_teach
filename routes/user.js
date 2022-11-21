var express = require('express');
const argon2 = require('argon2');
var { promisePool: mysql } = require('../lib/mysql');
var router = express.Router();

/* 顯示登入狀態 */
router.get('/', function(req, res, next) {
  const { user } = req.signedCookies;

  return res.render('user/index', {
    user: user ? JSON.parse(user) : null,
    title: 'Login status',
  });
});

/* 登出 */
router.post('/logout', function(req, res, next) {
  res.clearCookie('user');

  return res.redirect('/user');
});

/* 登入頁面 */
router.get('/login', function(req, res, next) {
  const { user } = req.signedCookies;

  if (user) {
    return res.redirect('/user');
  }

  const { fail } = req.query;
  return res.render('user/login', {
    fail,
    title: 'Login',
  });
});

/* 送出登入資訊 */
router.post('/login', async function(req, res, next) {
  const { username, password } = req.body;

  const [rows,fields] = await mysql.execute('SELECT * FROM `user` WHERE username = ?', [username]);

  // 帳號錯誤
  if (!rows || rows.length !== 1) {
    return res.redirect('/user/login?fail=1');
  }

  const user = rows[0];

  // 密碼錯誤
  if (!await argon2.verify(user.password, password)) {
    return res.redirect('/user/login?fail=1');
  }

  const cookieUserData = {
    username,
    name: user.name,
  };

  res.cookie('user', JSON.stringify(cookieUserData), { signed: true, maxAge:600 * 1000 });

  return res.redirect('/user/');
});

/* 註冊頁面 */
router.get('/register', function(req, res, next) {
  const { user } = req.signedCookies;

  if (user) {
    return res.redirect('/user');
  }

  const { fail } = req.query;
  return res.render('user/register', {
    fail,
    title: 'Register',
  });
});

/* 註冊 */
router.post('/register', async function(req, res, next) {
  const { username, password, password_check: passwordCheck, name } = req.body;

  if (password !== passwordCheck) {
    return res.redirect('/user/register?fail=1');
  }

  const hashedPassword = await argon2.hash(password);

  const [rows,fields] = await mysql.execute('INSERT INTO `user` (username, password, name) VALUES (?, ?, ?)', [username, hashedPassword, name]);

  return res.redirect('/user');
});

module.exports = router;
