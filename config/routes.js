/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': { view: 'pages/homepage' },
  'POST /signup':'AdminController.signup',
  'POST /login':'AdminController.login',
  'POST /logout':'AdminController.logout',
   
  'GET /category':'CategoryController.category',
  // 'GET /cate':'CategoryController.category',
  'GET /category/:id':'CategoryController.editCategory',
  'POST /category':'CategoryController.addCategory',
  'POST /category/:id':'CategoryController.updateCategory',
  'DELETE /category/:id':'CategoryController.deleteCategory',
  
  'GET /items':'ItemsController.items',
  'GET /items/:id':'ItemsController.editItems',
  'POST /items':'ItemsController.addItems',
  'POST /items/:id':'ItemsController.updateItems',
  'DELETE /items/:id':'ItemsController.deleteItem',
  
  'GET /menu': 'CategoryController.menu',
  'POST /file':'FileController.upload',
   
  'GET /bill': 'OrderController.totalBills',
  'POST /bill':'OrderController.bill',
  'POST /addorder':'OrderController.addOrder',
  'GET /bill/:id':'OrderController.billing',
  'POST /bill/:id':'OrderController.updateOrder',
  'GET /billing/:id':'OrderController.deleteOrder',

  'PUT /hi':'OrderController.hi'

 





  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
