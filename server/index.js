import http from 'http';
import app from './server';
// import { connect } from './db';

const server = http.createServer(app);
let currentApp = app;

const port = process.env.PORT || 4000;

(async () => {
    try {
        // console.log('TRY: connect and server.listen');
        // await connect();
        server.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    } catch (e) {
        console.error(e);
    }
})();

if (module.hot) {
    console.log('module hot');
    module.hot.accept('./server', () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app;
    });
}
