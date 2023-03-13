/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const bcrypt=require('bcrypt');
 const jwt=require('jsonwebtoken');
const { process } = require('../../config/env/constants');


module.exports = {

    // signup route
    signUp:async(req,res)=>{
        const {email,password}=req.body
        const admins =await Admin.find({email:email});
        const emailformat=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        const emails=emailformat.test(email)
        //email validation
        if(admins.length != 0){
            return res.status(400).json({message:'email was exists'})
        }
        else{
            if(!emails){
                console.log(emails );
                return res.status(400).json({message:'Email format was incorrect'});
            }
            if(password.length != 8){
                console.log(password.length);
                return res.status(400).json({message:'incorrect'});
            }
            else{
                const admin= await Admin.create({email,password}).fetch();
                if(admin){
                   return res.status(201).json({message:'success'})
                }
                else{
                   return res.status(404).json({message:'failed to signup'})
                }
            }
        }
    },

    //admin login 
    logIn:async(req,res)=>{
        const {email,password}=req.body;
         //login validation 
        const admin=await Admin.findOne({email:email});
        if(!admin){
           return res.status(400).json({message:'invaild email and password'})
        }
        else{
            const token =await jwt.sign({id:admin.id},process.env.JWT_KEY,{
                expiresIn: '6h' // expires in 6 hours
                 });
            console.log(token);
            //update the token 
            const tokenupdate=await Admin.update({id:admin.id}).set({token:token});

        //password validation
            const adminlogin =await Admin.find({email});
            if(adminlogin){
                if (await bcrypt.compare(password, adminlogin[0].password)) {
                    return res.status(200).json({message:'success',token:token})
                  } else {
                    return res.status(400).json({message:'invaild password'})
                  }
            }
        }
        
    },
// Admin logout 
    logOut:async(req,res)=>{
        const id=req.adminId;
            const logout=await Admin.update({id:id}).set({token:null}).exec((err)=>{
                if(err){
                  return  res.status(400).json({message:'logout failed'})
                }else{
                  return  res.status(400).json({message:'logout success',logout:logout})
                }
            });

        
      
        
    }
};

