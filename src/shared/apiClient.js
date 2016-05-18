import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path, req) {
  const adjustedPath = path[0] !== '/' ? '/${path}' : path;
  if (!__CLIENT__ && req) {
    return `${req.protocol}://${req.get('host')}${adjustedPath}`;
  }
  return adjustedPath;
}

class ApiClient {
  constructor(req) {
    methods.forEach(method => (
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path, req));

        if (!__CLIENT__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (params) {
          request.query(params);
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)));
      })
    ));

    if (!__CLIENT__) {
      this.getServerReq = () => req;
    }
  }
}

export default ApiClient;
