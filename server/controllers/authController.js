import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic empty fields validation
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Email format validation (using validator package)
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // 3. Password length validation (Minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 4. Email Normalization
    const normalizedEmail = email.toLowerCase().trim();

    // 5. Check Existing User
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 6. Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Create User in DB
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 8. Success Response
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

//Login Controller
export const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body;

        //Validation
        if (!email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            })
        }

        if (!validator.isEmail(email)) {
    return res.status(400).json({
        success:false,
        message:"Please enter a valid email"
    });
}


        const normalizedEmail = email.toLowerCase().trim();
        //Find User
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        //Compare Password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        //Generate JWT
        const token = jwt.sign(
            {
              id: user._id,  
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, {
  httpOnly: true,
      secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

return res.status(200).json({
  success: true,
  message: "Login Successful",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

    


// res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
// });

// return res.status(200).json({
//     success: true,
//     message: "Logout Successful",
// });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const getCurrentUser = (req,res)=>{

    return res.status(200).json({
        success:true,
        user:req.user
    })

}

export const logoutUser = async (req, res)=>{
 try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}