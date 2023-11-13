import { Schema,Types,model } from "mongoose"
const PostSchema = new Schema({

    content: {
        type: String,
        required: [true, 'can not share empty post'],//lw hwa md5lho4 hytl3 al error dh
    },
    Images:[{type:Object}],
    Videos:[{type:Object}],
    customID:{type:String},
    Likes:[{
        type:Types.ObjectId,
        ref:'User'
    }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    comments:[{
        type: Types.ObjectId, ref: 'Comment'
    }],
    privacy:{
        type:String,
        enum:['only me','Public'],
        default:'Public'
    }
   
},{
    timestamps: true
})

const PostModel = model('Post', PostSchema)
export default PostModel