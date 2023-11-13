import { Schema,Types,model } from "mongoose"
const ReplySchema = new Schema({

    ReplyBody: {
        type: String,
    },
    customID:{type:String},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    image:{secure_url:{type:String},public_id:{type:String}},
    CommentID:{
        type:Types.ObjectId,
        ref:'Comment',required:true
    },
    Likes:[{
        type:Types.ObjectId,
        ref:'User'
    }],
   
},{
    timestamps: true
})

const ReplyModel = model('Reply', ReplySchema)
export default ReplyModel