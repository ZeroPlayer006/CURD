import mongoose from "mongoose";

const userSchema = mongoose.Schema( {
    name: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    gender: { type: String, require: true },
    age: { type: Number, require: true },
    address: { type: String, require: true }
} );

export default mongoose.model( "Users", userSchema );