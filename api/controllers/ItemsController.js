/**
 * ItemsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */




module.exports = {
  //get all items
  items: async (req, res) => {
    const { page, limit,search } = req.query;
    const skip = (page - 1) * limit;
    const pagelimit = parseInt(limit); 
    let whereClause = { isDelete: false };
    let selectClause = ['id', 'itemname','description','price','displayOrder','image'];
    let query = {};
    if (limit) {
      query.skip = skip;
      query.limit = pagelimit;
    }
    if (search) {
            const searchcharacter=search.replace(/[^A-Za-z ]/gm, "")
            console.log(search);
            whereClause.itemname = { contains:searchcharacter};
            console.log(whereClause.itemname);
    }
        query.where = whereClause;
        query.select=selectClause
    let items = await Items.find(query).meta({makeLikeModifierCaseInsensitive: true})
        .populate(
      'category');
            console.log(items);
    return res.status(200).json({
      page,
      items
    });

  },
//add items
  addItems: async (req, res) => {
    const { itemname, description, price, category, image, displayOrder } =
      req.body;
    const items = await Items.find({ where:
      {
      or:[{itemname:itemname,category:category,isDelete:false}],
      or:[{category:category,displayOrder:displayOrder,isDelete:false}]
    } });
   
    //item name and category validation
    if(items.length !=0){
      res
      .status(404)
      .json({
        message: `item name was existed or check display order ${displayOrder} again `,
      });
    }
    else{
      //display order validation
      const item = await Items.create({
        itemname: itemname,
        description: description,
        price: price,
        category: category,
        image: image,
        displayOrder: displayOrder,
      }).fetch();
     
  return res.status(200).json({ message: "success", item: item });
   
       
        }
      //create new item 
  },
//get item details
  editItems: async (req, res) => {
    const id = req.params.id;
    const item = await Items.findOne({ id: id,isDelete:false });
    if (item) {
      res.status(200).json({ message: "Item was found", item: item });
    } else {
      res.status(200).json({ message: "id not found" });
    }
  },
//update item
  updateItems: async (req, res) => {
      const { itemname, description, price, category, image, displayOrder } = req.body;
      const id = req.params.id;

      //item name and category validation
     const item = await Items.updateOne(id, {
       itemname: itemname,
       description: description,
       price: price,
       category: category,
       image: image,
       displayOrder: displayOrder,
       updatedAt:new Date()
     })
       res.status(200).json({message:'success',item:item}); 
  },

//delete items
  deleteItem:async(req,res)=>{
    const id = req.params.id;
    const items=await Items.update(id,{isDelete:true,deletedAt:new Date()})
    .then((err)=>{
        if(err){
            res.status(404).json({message:'failed to update'})
        } 
      }).catch((err)=>{
        console.log(err);
        res.status(404).json({error:err});
    });
      res.status(200).json({message:'success deleted',items})
  }
};

        
