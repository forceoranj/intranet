// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseEmulator: true,
};

export const firebaseConfig = {
  apiKey: "apikey123",
  authDomain: "localhost:9099",
  authUrl: "http://localhost:9099",
  databaseURL: "http://localhost:9000/?ns=forceoranj",
  projectId: "forceoranj",
  storageBucket: "forceoranj.appspot.com",
  messagingSenderId: "308769634451",
  appId: "1:308769634451:web:c2aaa11fce42e6d7b0b566"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
