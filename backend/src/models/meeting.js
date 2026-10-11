import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    userId : {type : String},
    meetingCode : {type : String, required : true},
    date : {type : Date, default : Date.now, required : true},
    //monad blockchain address
    blockchainMeetingId: {type : String, default : null},
    transactionHash: {type : String, default : null},
    walletAddress: {type : String, lowercase : true, trim : true, default : null},

});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };