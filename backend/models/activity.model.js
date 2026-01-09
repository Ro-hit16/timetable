import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({

    type:{
        type:String,
        enum:['teacher','timetable','subject','department'],
        required:true
    },
    action:{
        type:String,
        required:true
    },
    details:
    {
        type:String
    }
    

},
{
    
        timestamps:true
    });
export default mongoose.model('Activity', activitySchema);