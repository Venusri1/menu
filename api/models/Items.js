/**
 * Items.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    itemname: { 
      type: "string", required: true 
    },
    description: { 
      type: "string", required: true 
    },
    price: { 
      type: "number", required: true 
    },
    image: { 
      type: "string"
    },
    category:{
      model:'Category'
    },
    displayOrder:{
      type: "number", required: true ,
    },
    createdAt:{
      type:'ref',
      columnType:'date',
      defaultsTo: new Date()
    },
    updatedAt:{
      type:'ref',
      columnType:'date'
    },
    deletedAt:{
      type:'ref',
      columnType:'date'
    },
    isDelete:{
      type: 'boolean', 
      defaultsTo: false,
    },
    bill:{
      collection:'bill',
      via:'items',
      through:'order'
    },
    order:{
      model:'order'
    }
    
  },


  datastore: "mongodb",
};
