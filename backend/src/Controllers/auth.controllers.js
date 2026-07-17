const usermodel = require("../Model/usermodel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function register(req,res){
    const {username,email,phone,password,role} = req.body
    const userexist = await usermodel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(userexist){
        return res.status(409).json({
            message:"user already exist"
        })
    }
    const hash = await bcrypt.hash(password,10)
    const user = await usermodel.create({
        username,
        email,
        phone,
        password:hash,
        role
    })
    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
        message:"Register Successfully",
        user
    })
}

async function login(req,res){
    const {identity,password} = req.body
    const user = await usermodel.findOne({
            $or:[
                {phone:identity},
                {email:identity}
            ]
    })
    if(!user){
        return res.status(401).json({
            message:"user not registered"
        })
    }
    const ismatch = await bcrypt.compare(password,user.password)
    if(!ismatch){
        return res.status(401).json({
            message:"Invalid password"
        })
    }
    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
});
    res.status(200).json({
  message: "Login Successfully",
  user: user,
});
}

function me(req, res){
    try {
        res.json({
            user: req.user,
        });
    } catch (error) {
        res.status(401).json({
            message: "Unkown",
        });
    }
}

function logout(req,res){
    try {
        res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        });
        return res.status(200).json({
            message:"Logout Successful"
        })
    } catch (error) {
        console.log(error)
    }
}

async function updateprofile(req,res){
     const userId = req.user.id;
    const { username, email, phone } = req.body;
    const existingUser = await usermodel.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const user = await usermodel.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        phone,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
}



module.exports = {register,login,me,logout,updateprofile}
