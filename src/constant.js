export default {

    // Variables to control the code and feature based on sapces,
    // So that even after merging code does not break or go into production without testing.

    isLocal: false, //When running it locally.
    isDev: false,  //For dev space only, also this should be true while deploying to Dev space
    isTest: true, // for test space only, this should be true while deploying to test space
    isProd: false, // for prod space only, and while deploying to the prod

    version: "0.5.7",
    lastBuild: "11-06-2025"
    //Excess OT developed 

    // version: "0.5.4",
    // lastBuild: "29-05-2025"

};