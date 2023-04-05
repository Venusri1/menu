/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    items:{
      model:'items'
    },
   bill:{
    model:'bill'
   },
   quantity:{
    type:'number',
    defaultsTo:1
   }
  },
  datastore: "mongodb",
};

