const express = require("express")
const User = require("../Models/user.model")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

exports.CreateUser = async (req, res) => {
    try {
        let { userName, email, password, role } = req.body;

        password = bcrypt.hashSync(password, 10)


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const newUser = new User({
            userName,
            email,
            password,
            role
        })
        await newUser.save();
        res.status(200).json({ message: "User created" })
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong", err });
    }
}

exports.LoginUser = async (req, res) => {
    try {
        var { email, password } = req.body;

        const result = await User.findOne({ email: email });
        if (!result) return res.status(402).json({ status: "failed", message: "Invalid Email or Password" })

        if (!bcrypt.compareSync(password, result?.password)) return res.status(402).json({ status: "failed", message: "Invalid Email or Password" })

        var { password, ...other } = result?._doc;


        let Token = JWT.sign({ UserData: other }, "ThisIsTokenPassword", { expiresIn: "7d" })

        res.status(200).json({
            status: "success",
            message: "Successfully logged in",
            Token
        });
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
};