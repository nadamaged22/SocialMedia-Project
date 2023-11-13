import { Schema,Types,model } from "mongoose"
const CommentSchema = new Schema({

    CommentBody: {
        type: String,
    },
    customID:{type:String},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    image:{secure_url:{type:String},public_id:{type:String}},
    postID:{
        type:Types.ObjectId,
        ref:'Post',required:true
    },
    Likes:[{
        type:Types.ObjectId,
        ref:'User'
    }],
    Replies:[{
        type:Types.ObjectId,
        ref:'Reply'
    }]
   
},{
    timestamps: true
})

const CommentModel = model('Comment', CommentSchema)
export default CommentModel