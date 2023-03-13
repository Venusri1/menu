/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */




module.exports = {
    category:async(req,res)=>{
        
        const { page, limit,search } = req.query;
        const skip = (page - 1) * limit;
        const pagelimit = parseInt(limit);
        const whereClause={isDelete:false}
        let query = {};
        if (limit) {
          query.skip = skip;
          query.limit = pagelimit;
        }
        if (search) {
                const searchcharacter=search.replace(/[^A-Za-z ]/gm, "")
                console.log(search);
                whereClause.name = { contains:searchcharacter};
                console.log(whereClause.name);
        }
            query.where = whereClause;
        let category = await Category.find(query).meta({makeLikeModifierCaseInsensitive: true})
            .populate(
          'items');
       
        return res.status(200).json({
            page,
            category
        })
    
    },

    //add category 
    addCategory:async(req,res)=>{
        const {name}=req.body
        const category=await Category.find({name:name,isDelete:false});
        //category name validation
        if(category.length != 0){
            return res.status(400).json({message:'category was exists'})
        }else{
            //create a category
            const addcategory=await Category.create({name:name}).fetch();
            if(addcategory){
                console.log(addcategory);
               return res.status(200).json({message:'success', category:addcategory})
            }else{
               return res.status(404).json({message:'category was not found'})
            }

        }
      
    },
//get category by id
    editCategory:async(req,res)=>{
        const id=req.params.id;
        const category =await Category.findOne({id:id,isDelete:false }).then((category)=>{
            console.log(category);
            if(category){
                return res.status(200).json({message:'category details',category:category})
            }
            else{
                return res.status(404).json({message:'id was not found'})
            } 

        })
        .catch((err)=>{
            console.log(err);
           return res.status(404).json({error:err});
        });
        console.log(category);
    },
// update category name 
    updateCategory:async(req,res)=>{
        const id=req.params.id;
        const {name}=req.body;
        const category=await Category.findOne({name:name,isDelete:false});
        //category name validation
        if(category){
            return res.status(400).json({message:'category was exists'})
        }else{
            //update a category
            const category=await Category.updateOne(id,{name:name,updatedAt:new Date()})
            .then((category)=>{
                if(category){
                    return  res.status(200).json({message:'success',category})
                }else{
                    return res.status(404).json({message:'failed to update'})

                  }
              })
        }
      
    },
//delete category 
    deleteCategory:async(req,res)=>{
        const id=req.params.id;
        //finding item which store particular category and delete the item also
        const items=await Items.updateOne({category:id}).set({isDelete:true})
   
        const category=await Category.updateOne(id,{isDelete:true,deletedAt:new Date()})
        .then((err)=>{
            if(err){
               return res.status(404).json({message:'failed to delete'})
            } 
          }).catch((err)=>{
            console.log(err);
            return res.status(404).json({error:err});
        });
         return res.status(200).json({message:'success deleted',category:category,item:items})
    },
//user dashboard
    menu: async (req, res) => {
        const category = await Category.find({ isDelete: false })
             .populate("items",{ where:{isDelete:false}},{sort:'displayOrder ASC'})
          if(category) {
            const resp = {
              count: category.length,
              category: category.map((category) => {
                return {
                  name: category.name,
                  totalitems: category.items.length,
                  items: category.items.map((item)=>{
                    return {
                        id: item.id,
                        itemname:item.itemname,
                        price:item.price,
                        image: item.image,
                        displayOrder: item.displayOrder,
                    }
                  })
                };
              }),
            };
           return res.status(200).json(resp);
          };

        console.log(category);
      },
};
