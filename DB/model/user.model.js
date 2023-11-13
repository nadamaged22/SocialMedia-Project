
import { Schema,Types,model } from "mongoose";
const userSchema = new Schema({

    username: {
        type: String,
        required: [true, 'userName is required'],//lw hwa md5lho4 hytl3 al error dh
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    Email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    age:{
        type:Number
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    coverImage:{secure_url:String,public_id:String},
    Profileimage:{secure_url:String,public_id:String},
    code:{
        code:{
            
            type:String,
            min: [6, 'Code Length must not exceed 6'],
            max: [6, 'Code Length must not exceed 6'],
        },
        expdate:{
            type:Date
        }
},
    isDeleted:{
    type: Boolean,
    default: false,
    }
    
}, {
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    timestamps: true
})
userSchema.virtual('Post',{
    ref:'Post',//will iterate on what collection
    foreignField:'createdBy',//al relation 2ly hm4y 3alyha 3l4an agyb al data mn al model al tany
    localField:'_id'//al field 2ly fy al collection dh marbot b aih fy 2ly ana wa2f 3ando dlw2ty
})


const userModel = model('User', userSchema)
export default userModel