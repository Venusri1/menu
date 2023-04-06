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
    const item=await Items.findOne({id:items,isDelete:false});
    if(!item){
        res.status(500).json({message:'db error'})
    }else{
        const totalbill=await Order.findOne({id:id}).populateAll();
        let ttb=quantity-totalbill.quantity;
        let amount=totalbill.items.price * ttb
        let totalbalance=totalbill.bill.balance + amount;
        if(ttb < 0){
            ttb=totalbill.quantity - quantity;
            amount=totalbill.items.price * ttb;
           totalbalance=totalbill.bill.balance - amount;
        }
        if(ttb == 0){
          ttb=quantity;
         return res.status(200).json({message:'it was already updated'})
        }
        console.log("ttb",ttb);
        console.log(amount);
        console.log(totalbill.bill.balance); 
        const orders=await Order.update({id:id},{items:items,quantity:quantity}).exec((err)=>{
                if(err){
                    res.status(200).json({message:'db error'})
                }else{
                    res.status(200).json({message:'success'})
                }
            });
            const updatebill=await Bill.updateOne(totalbill.bill.id,{balance:totalbalance})
            console.log("orders",orders);
       
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
    const amount=deleteorder.items.price * deleteorder.quantity
 
    const order=await Order.destroy({id:id}).exec((err)=>{
        if(err){
            res.status(200).json({message:'db error'})
        }else{
            res.status(200).json({message:'success'})
        }
    })
     const bill=await Bill.findOne({id:billId});
     const balance=bill.balance - amount
     console.log(balance);
     const updatebill=await Bill.updateOne(billId,{balance:balance})

   },

   hi:async(req,res)=>{
    const {id}=req.body;
    // console.log(order);
    // const item=await Order.findOne({id:order.id});
    // console.log(item);
    res.status(200).json(id)

   }

   


  

};

