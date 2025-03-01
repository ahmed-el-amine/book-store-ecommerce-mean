import  mongoose  from 'mongoose'
import { timestamp } from 'rxjs';

const BookModel = new mongoose.Schema({
  title:{
    type:String,
    minLength:[5,'Book title must be 5 character at least'],
    required:true,
    unique:true,
  },isbn13:{
    type:String,
    required:true,
    validate:{
      validator:function(v){
        return v.length === 13;
      },
      message:'ISBN-13 must be 13 characters'
    }
  },
  description:{
      type:String,
      required:true,
      minLength:[15,'Book description must be 15 character at least']
  },
  price:{
    type:Number,
    required:true,
    index:true
  },
  rating:{
    type:Number,
    required:true
  },
  publish_date:{
    type:Date,
    required:true,
    index:true
  },
  stock:{
    type:Number,
    required:true,
    min:0
  },
  coverImage:{
    type:String,
    required:true
  },
  dimensions:{
    width:Number,
    height:Number,
    depth:Number,
    unit:{
      type:String,
      default:'cm'
    }
  },
  weight:{
    value:Number,
    unit:{
      type:String,
      default:'g'
    }
  }
  ,
  authors:{
    type: [mongoose.Schema.Types.ObjectId],
    required:true,
    ref:'Author'
  },categories:{
    type:[String],
    required:true,
    index:true
  }

},{timestamps:true});

const Books = mongoose.model('Books',BookModel);

export default Books;
