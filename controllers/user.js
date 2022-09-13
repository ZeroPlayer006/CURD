import bcrypt from 'bcryptjs';
import { request, response } from 'express';
import jwt from 'jsonwebtoken';

import Users from "../models/userModel.js";

export const register = async ( req, res ) => {
    const { password, name, email, number, gender } = req.body;

    try {
        const existingUser = await Users.findOne( { name } );
        if ( existingUser ) return res.status( 400 ).json( { message: 'User Name already exists.' } );

        const existingEmail = await Users.findOne( { email } );
        if ( existingEmail ) return res.status( 400 ).json( { message: 'Email already exists.' } );

        const existingNumber = await Users.findOne( { number } );
        if ( existingNumber ) return res.status( 400 ).json( { message: 'Number already exists.' } );

        const hasedPassword = await bcrypt.hash( password, 12 );
        const result = await Users.create( { name, password: hasedPassword, email, number, gender } );

        const token = jwt.sign( { name: result.name, id: result._id }, 'FirstJwtTokenCreation', { expiresIn: '1h' } );
        res.status( 200 ).json( { userId: result._id, token } );

    } catch ( error ) {
        res.status( 500 ).json( { message: error.message } );
    }
};

export const signIn = async ( request, response ) => {

    const { email, password } = request.body;

    try {
        const existingUser = await Users.findOne( { email } );
        if ( !existingUser ) return response.status( 400 ).json( { message: "User dosen't exist." } );

        const isCorrectPassword = password === existingUser.password;
        if ( !isCorrectPassword ) return response.status( 400 ).json( { message: "Invalid credentials." } );

        const token = jwt.sign( { name: existingUser.name, id: existingUser._id }, 'FirstJwtTokenCreation', { expiresIn: '1h' } );
        response.status( 200 ).json( { userId: existingUser._id, token } );

    } catch ( error ) {
        response.status( 500 ).json( { message: error.message } );
    }
};

export const insertMany = async ( request, response ) => {
    try {
        await Users.insertMany( request.body );
        response.status( 200 ).json( { message: "multiple values inserted sucessfully" } );
    } catch ( error ) {
        response.status( 500 ).json( { message: error.message } );
    }
};

export const updateAge = async ( request, response ) => {
    const { email, password, age, address } = request.body;
    try {
        await Users.findOneAndUpdate( { email, password }, { age, address } );
        response.status( 200 ).json( { message: "age and address updated sucessfully" } );
    } catch ( error ) {
        response.status( 500 ).json( { message: error.message } );
    }
};

export const deleteUser = async ( request, response ) => {
    const { email } = request.body;
    try {
        await Users.findOneAndDelete( { email } );
        response.status( 200 ).json( { message: "user deleted sucessfully" } );
    } catch ( error ) {
        response.status( 500 ).json( { message: error.message } );
    }
};
