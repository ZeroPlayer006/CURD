import express from "express";
import mongoose from "mongoose";
import userRoutes from './routes/user.js';
import userModel from "./models/userModel.js";
import mongooseDummy from 'mongoose-dummy';
const app = express();

app.use( express.json() );
app.use( '/user', userRoutes );

app.use( '/dummyData', async ( request, response ) => {
    const data = [];
    for ( let index = 0; index < 4; index++ ) {
        let randomObject = mongooseDummy( userModel, {
            returnDate: true
        } );
        data.push( randomObject );
    }
    response.status( 200 ).json( data );
} );

const CONNECTION_URL = 'mongodb://127.0.0.1:27017/Dummy?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4';
const PORT = 1982;

mongoose.connect( CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then( () => app.listen( PORT, () => console.log( `server is running on port :${PORT}` ) ) )
    .catch( ( error ) => console.log( error.message ) );