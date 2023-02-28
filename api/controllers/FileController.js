/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { process } = require("../../config/env/constants");



 module.exports = {
    
    upload:async(req,res)=>{
        let files = req.file('file');
        // console.log("files", files);
        console.log("path",process.env.key);
        let file= await files.upload({
            dirname:process.env.BASE_PATH
        },
            (err,file)=>{
            if(err){
                console.log(err);
            }
            console.log(file);
           return res.status(200).json({message:'success',file})
            
        })
        // console.log(file);

    }
};

