var express = require('express');
var router = express.Router();

/* 顯示登入狀態 */
router.get('/', function(req, res, next) {
  const { user } = req.signedCookies;

  return res.render('user/index', {
    user,
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
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin-password') {
    res.cookie('user', username, { signed: true, maxAge:600 * 1000 });

    return res.redirect('/user/');
  }

  return res.redirect('/user/login?fail=1');
});

module.exports = router;
