/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

   totalBills:async(req,res)=>{
    const tt=await Bill.find({})
    .populate('items',{select:['id']});
    res.status(200).json(tt)
   },

   bill:async(req,res)=>{
    const bill=await Bill.create({}).fetch();
    if(bill){
        console.log(bill);
        res.status(200).json(bill)
    }else{
        res.status(200).json({message:'db error'})
    }
   },

   addOrder:async(req,res)=>{
    const {items,bill,quantity}=req.body;
    const sameorder=await Order.findOne({items:items,bill:bill})
    if(sameorder){
        res.status(200).json({message:'Order was already added Exists'})
    }else{
        const order=await Order.create({items:items,bill:bill,quantity:quantity}).fetch()
            if(order){
                res.status(200).json({message:'added'})
            }else{
                res.status(200).json({message:'db error'})
            }
            const totalbill=await Order.find({bill:bill}).populate('items');
            // console.log(totalbill);
        
            let arr=[];
            let q=[];
            let sum=0;
            for(let i=0;i<totalbill.length;i++){
                arr.push(totalbill[i].items)
                q.push(totalbill[i].quantity)
            }
            console.log(arr);
            console.log(q);
           for(let j=0; j<arr.length || j <q.length;j++){
              console.log(arr[j].price*q[j]);
              sum +=arr[j].price*q[j];
           }
          
            console.log(sum);
    
        const billing=await Bill.update({id:bill}).set({balance:sum}).exec((err)=>{
            if(err){
                console.log('not');
            }else{
                console.log('completed');
            }
        });
    }
        
   },
   billing:async(req,res)=>{
    const id=req.params.id
    const bill=await Order.find({bill:id}).populateAll()
    res.status(200).json({bill})
   },

   updateOrder:async(req,res)=>{
    const id=req.params.id
    const {items,quantity}=req.body;
    console.log(items);
    const item=await Items.findOne({id:items});
    console.log(item);
    if(!item){
        res.status(500).json({message:'db error'})
    }else{
        const orders=await Order.update({bill:id},{items:items,quantity:quantity}).exec((err)=>{
            if(err){
                console.log('not');
            }else{
                console.log('completed');
            }
        });
        const totalbill=await Order.find({bill:id}).populateAll();
        console.log("totalbill",totalbill);
        let arr=[]
        let q=[];
        let sum=0;
        for(let i=0;i<totalbill.length;i++){
            arr.push(totalbill[i].items)
             q.push(totalbill[i].quantity)
        }
         console.log("arr",arr);
         console.log(q);
        for(let j=0; j<arr.length || j <q.length;j++){
            console.log(arr[j].price*q[j]);
            sum +=arr[j].price * q[j];
        }
        
        const billing=await Bill.update({id:id}).set({balance:sum}).exec((err)=>{
            if(err){
                console.log('not');
            }else{
                console.log('completed');
            }
        });
        res.status(200).json({message:'success',sum})
        console.log(billing);
      
    }

   },

//    billing:async(req,res)=>{
//     const id=req.params.id
//     const totalbill=await Order.find({bill:id}).populate('items');
//     console.log(totalbill);
//     let arr=[];
//     let sum=0;
//     let q=[]
//     for(let i=0;i<totalbill.length;i++){
//         arr.push(totalbill[i].items)
//         q.push(totalbill[i].quantity)
//     }
//     console.log(arr);
//     console.log(q);
//    for(let j=0; j<arr.length || j <q.length;j++){
//       console.log(arr[j].price*q[j]);
//       sum +=arr[j].price*q[j];
//    }
  
//     console.log(sum);

//     // const billing=await Bill.update({id:id}).set({balance:sum}).exec((err)=>{
//     //     if(err){
//     //         console.log('not');
//     //     }else{
//     //         console.log('completed');
//     //     }
//     // });
//      res.status(200).json(totalbill)
//    },

   deleteOrder:async(req,res)=>{
    const id=req.params.id;
    const deleteorder=await Order.findOne({id:id}).populate('items');
    const billId=deleteorder.bill;
    console.log(billId);
    const order=await Order.destroy({id:id}).exec((err)=>{
        if(err){
            res.status(200).json({message:'db error'})
        }else{
            res.status(200).json({message:'success'})
        }
    })
    const bill=await Bill.find({id:billId});
    const balance=bill[0].balance - deleteorder.items.price;
    const updatebill=await Bill.update(billId,{balance:balance})

   },

   


  

};

