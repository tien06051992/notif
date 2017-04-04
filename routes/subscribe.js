var express = require('express');
var router = express.Router();
var cache = require('memory-cache');

/* GET users listing. */
router.post('/:id', function(req, res, next) {
  var id = req.params.id || 'DEFAULT';
  var clientKey = 'USER_' + id;
console.log(req)
  cache.put(clientKey, JSON.stringify(req.body));
  console.log('SAVED', cache.get(clientKey))
  return res.json({ message: 'OK' });
});

router.delete('/:id', function(req, res, next) {
  var id = req.params.id || 'DEFAULT';
  var clientKey = 'USER_' + id;
  console.log('DELETING', req.body)
  cache.del(clientKey);
  console.log('DELETED', cache.get(clientKey))
  return res.json({ message: 'DELETED' });
});

module.exports = router;
