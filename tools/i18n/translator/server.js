/**
 * Translator server for development
 * @author leoliaolei@gmail.com, 2022/01/04, created
 */

const _ = require('lodash');

const restify = require('restify');
const appConfig = require('./config.js').appConfig;
const corsMiddleware = require('restify-cors-middleware');
const server = restify.createServer({
    name: 'oplus-translator',
    version: '1.0.0'
});
const cors = corsMiddleware({
    allowHeaders: ['Authorization', 'Tenant-Id', 'Language', 'Nonce', 'Timestamp'],
    origins: ['*'],
});
const transDao = require('./trans-dao').transDao;
const transFinder = require('./trans-finder').transFinder;
const SERVER_PORT = appConfig.serverPort || 3001;

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

function logRequest(req) {
    console.debug('%s: %s', req.method, req.url);
}

server.pre(function (request, response, next) {
    logRequest(request);
    next();
});

server.post('/api/i18n/translations', function (req, res, next) {
    transDao.saveAllTrans(req.body).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        return next(err);
    });
});

server.get('/api/i18n/translations', function (req, res, next) {
    var result = transDao.loadAllTrans();
    res.send(result);
    return next();
});

server.get('/api/i18n/references', function (req, res, next) {
    var forceReload = !!req.query.forceReload;
    // console.log('forceReload=%o', forceReload);
    transFinder.findAllRefs(forceReload, req.headers.authorization).then(function (data) {
        res.send(data);
    }).catch(function (err) {
        next(err);
    });
});

server.post('/api/i18n/translate', function (req, res, next) {
    transDao.translate(req.body).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        return next(err);
    });
})

server.get('/test/findDuplicated', function (req, res, next) {
    var result = transDao.loadAllTrans();

    var intersection = _.intersectionWith(result, result, function (i1, i2) {
        return i1.trans['zh-cn'] === i2.trans['zh-cn'] && i1.key !== i2.key
    })

    res.send(_.map(intersection, function(m) {return m.trans['zh-cn'] }));
    return next();
})

server.post('/api/i18n/convert', function (req, res, next) {
    var { langCode, translateCode } = req.body
    var result = transDao.convertPrimaryToOthers(langCode, translateCode)
    res.send('success');
    return next()
})

server.post('/api/i18n/save', function (req, res, next) {
    var { key, trans } = req.body
    transDao.save(key, trans).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        return next(err);
    });
})

server.post('/api/i18n/rename', function (req, res, next) {
    var { oldKey, newKey } = req.body
    transDao.rename(oldKey, newKey).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        return next(err);
    });
})

server.post('/api/i18n/merge', function (req, res, next) {
    var { oldKey, newKey } = req.body
    transDao.merge(oldKey, newKey).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        return next(err);
    });
})

server.post('/api/i18n/remove', function (req, res, next) {
    var { key } = req.body
    transDao.remove(key).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        return next(err);
    });
})

server.listen(SERVER_PORT, function () {
    console.log('[%s] listening at %s', server.name, server.url);
});