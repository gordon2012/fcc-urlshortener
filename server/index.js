import http from 'http';
import app from './server';

const server = http.createServer(app);
let currentApp = app;
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

if (module.hot) {
    console.log('module hot');
    module.hot.accept('./server', () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app;
    });
}
