// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    appName: "sma-exp",
    version: "0.0.1",
    production: false,
    // appName: require('../../package.json').name,
    // appVersion: require('../../package.json').version,
    // appDependencies: require('../../package.json').dependencies,
    keyToken: 'sma-exp_jwt',
    mapbox: {
        accessToken: 'pk.eyJ1IjoidGdhdXRpZXIiLCJhIjoiY2t5eXBxZmthMDFoMjJ1azQ2bzdqNjg5aiJ9.JlxVT_17ky6yKSohtKseig'
    },
    api: {
        server: 'https://api-gsa-v4.herokuapp.com'
    },
    sign: {
        server: 'https://api-gsa-v4.herokuapp.com'
    },
    db: {
        server: "http://localhost:3000"
    },
    auth: {
        server: "http://localhost:3000"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
