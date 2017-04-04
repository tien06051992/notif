var express = require('express');
var webpush = require('web-push');
var cache = require('memory-cache');
var router = express.Router();
const publicKey = "BMpNUuF0a5Tre77zfsbc6ujoViAVlmkMsYYhYJN87OpLm96upzEM6UL-PD5-4dKjy1bttlLPNqx8qPvmws-QWCs";
const privateKey ="G_RNZTE5zmjDwXyE9-Fg-8vdcCiLghzQknw__Dgk8Vc";

router.post('/:id', function(req, res, next) {
  // VAPID keys should only be generated only once.
  webpush.setVapidDetails(
    'mailto:cuongthinh@lozi.vn',
    publicKey,
    privateKey
  );

  var body = req.body;
  var pushPayload = {
    title: 'Lozi.vn',
    icon: body.data.image || 'https://lozi.vn/dist/cat.svg',
    message: body.message,
    data: {
      type: body.data.type,
      slug: body.data.slug,
      objectId: body.data.objectId
    }
  }
  console.log('PAYLOAD:', pushPayload)

  var id = req.params.id || 'DEFAULT';
  var clientKey = 'USER_' + id;
  var pushSubscription = cache.get(clientKey);

  if (!pushSubscription) {
    res.json({ message: 'NO_ENDPOINT' })
    return;
  }

  pushSubscription = JSON.parse(pushSubscription);

  webpush.sendNotification(pushSubscription, JSON.stringify(pushPayload))
    .then(function(result) {
      res.json({ message: 'OK', status: result.statusCode });
    })
    .catch(function(err) {
      console.error('ERROR', err)
      res.json({ message: 'ERROR_SEND_NOTIFICATION' });
      return;
    });
});

module.exports = router;
