/**
 * Bill.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    items:{
      collection:'items',
      via:'bill',
      through:'order'
    },
    balance:{
      type:'number',
      defaultsTo: 0,
    },
   

  },
  datastore: "mongodb"

};

