const mongoose=require('mongoose')
const {Schema}=require('mongoose')


const userSchema=new Schema({
    firstName:{
        type:String,
        minLength:5,
        maxLength:50,
        trim:true,
        required:true,
    },
    lastName:{
        type:String,
        minLength:5,
        maxLength:50,
        trim:true,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid!");
            }
        }

    },
    password:{
        type:String,
        trim:true,
        required:true,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{type:String,
            lowercase:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz68b1g8MSxSUqvFtuo44MvagkdFGoG7Z7DQ&s",
         validate(value){
            if(!validator.isURL(value)){
                throw new Error("PhotoUrl  is not valid!");
            }
        }
    },
    about:{
        type:String,
        minLength:10,
        maxLength:50,
        default:"This is the default user bio",
    },
    skills:{
        type:[],
    }
},{timestamps:true})

module.exports=mongoose.model("User",userSchema);