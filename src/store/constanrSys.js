/** This file is written so that Token can be changed everywhere from one place
 *  and to manage the endpoint.
 */
import constant from "../constant";

export default {
  //Space constant based values and especific system wide constant variables to use.
  endpoint: constant.isProd ? "" : constant.isLocal ? "http://localhost:4004" : "",


  insatnce: (constant.isLocal ? "Local, " : "") +
    (constant.isProd ? "Prod"
      : constant.isDev ? "Dev"
        : constant.isTest ? "Test" : "")


 

};