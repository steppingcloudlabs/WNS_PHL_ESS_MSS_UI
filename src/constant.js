

export default {

    // Variables to control the code and feature based on sapces,
    // So that even after merging code does not break or go into production without testing.

    isLocal: false, //When running it locally.
    isDev: false,  //For dev space only, also this should be true while deploying to Dev space
    isTest: true, // for test space only, this should be true while deploying to test space
    isProd: false, // for prod space only, and while deploying to the prod


    version: "1.3.2",
    lastBuild: "11-04-2025"
    // New Attandance code added

    // version: "1.3",
    // lastBuild: "07-04-2025"
    // Issue fixed for Subhead, and Scheme ID spaceing Issue

    // version: "1.2",
    // lastBuild: "27-03-2025"
    /** Fixes and All the PHL especific development is getting deployed. */

    // version: "1.1",
    // lastBuild: "25-03-2025"
    /** All the PHL especific development is getting deployed. */



    // version: "1.0.4",
    // lastBuild: "10-03-2025"
    /** V1.0.3 - is deployed on space dev. 
     * There is some changes in attandance for shri lanka , leave types updated, etc.
     */

    // version: "1.0.2",
    // lastBuild: "05-02-2025"
    /** V1.0.2 - Going to deploy on Dev. 
    */


    // version: "1.0.2",
    // lastBuild: "28-01-2025"
    /** V1.0.2 - is deployed on test. 
     * This one has changes related to dynamic country based pay period and 
     * vip upload payroll validation.
     */

    // version: "1.0.1",
    // lastBuild: "27-01-2025"
    /** V1.0.1 - is deployed on test. 
     * For CR in VIP while payroll upload, two new key are getting,
     *  which needs to be sent too, while initi of workflow.
     */
};