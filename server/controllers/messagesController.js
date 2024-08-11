const messageModel = require("../model/messageModel");

module.exports.addMessage=async(req,res,next)=>{
    try{
      const {from,to,message}=req.body;
      const data=await messageModel.create({
        message:{text:message},
        users:[from,to],
        sender:from,
      });
      if(data) return res.json({msg:"message added successfully."})
      return res.json({msg:"failed to add message to the database."})
    }catch(ex){
      next(ex);
    }
};
module.exports.getAllMessage=async(req,res,next)=>{
  try{
   const {from,to}=req.body;
   const messages=await messageModel.find({
    users:{
      $all:[from,to],
    },
   })
   .sort({updatedAt:1});
   const projectMessages=messages.map((msg)=>{
    return{
      fromSelf:msg.sender.toString()===from,
      message:msg.message.text,
    };
   });
   /*console.log(projectMessages);*/
   res.json(projectMessages);
  }catch(ex){
    next(ex);
  }
};