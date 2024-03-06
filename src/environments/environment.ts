export const environment = {
    appName: "sma-exp",
    version: "0.0.1",
    production: true,
    // appName: require('../../package.json').name,
    // appVersion: require('../../package.json').version,
    // appDependencies: require('../../package.json').dependencies,
    keyToken: 'sma-exp_jwt',
    mapbox: {
        accessToken: 'pk.eyJ1IjoidGdhdXRpZXIiLCJhIjoiY2t5eXBxZmthMDFoMjJ1azQ2bzdqNjg5aiJ9.JlxVT_17ky6yKSohtKseig'
    },
    api: {
        server: 'https://api-gsa-v4.herokuapp.com',
    },
    sign: {
        server: 'https://api-gsa-v4.herokuapp.com'
    },
    db: {
        server: "https://gsa-serve.vercel.app"
    },
    auth: {
        server: "https://gsa-serve.vercel.app"
    }
};
