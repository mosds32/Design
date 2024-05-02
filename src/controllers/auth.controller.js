import {prisma} from '../client/client.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { hashPassword } from '../utils/HashedPassword.js';
import { generateToken } from '../utils/GenerateTokens.js';
import { comparePassword } from '../utils/ComparePassword.js';
import { mail } from '../utils/Mail.js';
import generateOtp from '../utils/GenerateOtp.js';
import {cookieOptions}  from '../config/CookieOption.js';
export const signUp = asyncHandler(async (req, res) => {
    try {
 
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                user_email:email
            }
        });

        if (existingUser) {
            return res.status(402).json(new ApiResponse(402, "SignUp: User already exists"));
        }

        // Create a new user
        const hashedPassword = await hashPassword(password);
        const now = new Date();
        const newUser = await prisma.user.create({
            data: {
                user_email: email,
                user_password: hashedPassword,
                user_name: name,
                user_createdat: now,
                user_modifiedat: now,
                user_role:'admin',// Set OTP to false initially
                user_isverify: 0,
            }
        });

        if (!newUser) {
            return res.status(401).json(new ApiResponse(401, "SignUp: User not created"));
        }

        // Generate OTP and send it via email
        const otp = generateOtp();
        await mail(newUser.user_email, otp);
    
    await prisma.otp.create(
        {
            data: 
            {
              otp_number: otp,
              user_user_id: newUser.user_id,
              otp_createdat: now,
              otp_modifiedat: now
            }
        }
    );
        // Generate access token
        const currentUser = { Email: newUser.user_email }; // Just include the email for token generation
        const { accessToken } = generateToken(currentUser);
        await prisma.login.create({
            data: {
                user_user_id: newUser.user_id, // Provide the correct user's ID
                login_isactive: 1,
                login_createdat: now,
                login_modifiedat: now,
            }
        });
        
        
        return res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .json(new ApiResponse(200, "SignUp: User created successfully"));
    } catch (err) {
        console.error(err);
        throw new ApiError(403, err?.message || "SignUp: Something went wrong");
    }
});
// API : FOR USER LOGIN
export const login = asyncHandler(async (req, res) => {
    try {
        // Validate Credentials 
        // Proceed login
       
        const { email, password } = req.body;

        // Fetch user from the database based on email
        const user = await prisma.user.findFirst({
            where: {
                user_email: email
            },
            select: {
                user_id: true,
                user_name: true,
                user_email: true,
                user_password: true,
            }
        });

        // Check if user exists
        if (!user) {
            return res
                .status(404)
                .json(new ApiResponse(404, "Login : User not found"));
        }

        // Validate password
        const isPasswordValid = await comparePassword(password, user.user_password, res);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json(new ApiResponse(401, "Login : User Password Mismatched"));
        }

        // Generate access token
        const { accessToken } = generateToken(user);
        const now = new Date();

        // Update usersigin record
        const findUser = await prisma.login.findFirst(
            {
                where:
                {
                    user_user_id: user.user_id
                }
            }
        );
        await prisma.login.update({
            where: {
                login_id: findUser.login_id
            },
            data: {
                user_user_id: user.user_id,
                login_isactive: 1,
                login_createdat: now,
                login_modifiedat: now
            }
        });

   
 const responseData = {
    accessToken,
    user
 };


        // Respond with success message and set access token cookie
        return res
            .status(200)
            .clearCookie("accessToken")
            .cookie("accessToken", accessToken, cookieOptions)
            .json(new ApiResponse(200, "Login : You are successfully logined",responseData));
    } catch (err) {
        // Handle errors
        throw new ApiError(403, err?.message || "Login : Something Went Wrong");
    }
});
// API : FOR OTP VERIFICATION
export const otpVerify = asyncHandler(async (req, res) => {
    try {

        const userId = req.user.user_id;
        const  otpCode  = req.body.otpCode;
       const findUser = await prisma.user.findUnique(
        {
            where:
            {
                user_id:userId
            }
        }
       );
       if(!findUser)
       {
        return res.status(404).json(new ApiResponse(404, "User not Found"));
       }
     const OtpFinder = await prisma.otp.findFirst(
        {
            where:
            {
                otp_number: otpCode
            }
        }
      );
     if(!OtpFinder)
     {
        return res.status(404).json(new ApiResponse(404, "Otp Not Exist"));
     }
  const updateUser = await prisma.user.update(
    {
        where:
        {
            user_id: findUser.user_id
        },
        data:
        {
            user_isverify:1
        }
    }
  );
  if(updateUser)
  {
    return res.status(200).json(new ApiResponse(200, "Otp Verfied", updateUser));
  }
        
}
catch(error)
{
    throw new ApiError(403, error?.message || "Resend Otp Error");
}


});

export const resendOTP = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        const otp = generateOtp();

        const user = await prisma.user.findFirst({
            where: {
            user_email: email
            }
        });

        if (!user) {
            return res
                .status(404)
                .json(new ApiResponse(404, "ResendOTP : User not found"));
        }

        // Fetch the userotp record based on UserId
        const userotpRecord = await prisma.otp.findFirst({
            where: {
                user_user_id: user.user_id
            }
        });

        if (!userotpRecord) {
            return res
                .status(404)
                .json(new ApiResponse(404, "ResendOTP : User OTP record not found"));
        }

        // Update userotp record with new OTP
        const updateOTP = await prisma.otp.update({
            where: {
                otp_id: userotpRecord.otp_id
            },
            data: {
                otp_number: parseInt(otp), // Convert OTP to integer
                otp_createdat: new Date(),
                otp_modifiedat: new Date()
            }
        });

        // Send OTP to the user's email
        await mail(email, otp);

        return res
            .status(200)
            .json(new ApiResponse(200, "ResendOTP : OTP Resend Successfully"));
    } catch (err) {
        throw new ApiError(403, err?.message || "ResendOTP : Something went wrong");
    }
});


export const forgetPassword = asyncHandler(async (req, res) => {
    try {
        // Validate the input using the forgetPasswordValidator
        
        // Destructure the properties from the value object
        const { email, password, otpCode } = req.body;
        
        // Get the current date
        const now = new Date();
        
        // Initialize otp variable with otpCode or null
        let otp = otpCode || null;
        
        // Check if user exists with the provided email
        const user = await prisma.user.findFirst({
            where: {
                user_email: email
            }
        });

        // If user does not exist, return 404 status with appropriate message
        if (!user) {
            return res.status(404).json(new ApiResponse(404, "ForgetPassword: User not found"));
        }

        // Find the latest OTP record associated with the user
        const OtpFinder = await prisma.otp.findFirst({
            where: {
                user_user_id: user.user_id
            },
            orderBy: {
                otp_createdat: 'desc'
            }
        });

        // If no OTP code found, generate a new OTP, save it to database, and send email
        if (!OtpFinder?.otp_number) {
            const otp = generateOtp();
            const zipcodeUser = await prisma.otp.upsert({
                create: {
                    otp_number: `${otp}`,
                    user_user_id: user.user_id,
                    otp_createdat: new Date(Date.now())
                },
                update: {
                    otp_number: `${otp}`,
                },
                where: {
                    user_user_id: user.user_id,
                }
            });
            await mail(user.user_email, otp);
            return res.status(200).json(new ApiResponse(200, "ForgetPassword: User Email Sent Successfully"));
        }

        // Check if OTP code matches the provided otpCode
        let OTPValid = parseInt(OtpFinder.otp_number) === parseInt(otp);

        // If OTP is valid, update user's email verification status
        if (OTPValid) {
            await prisma.user.update({
                data: {
                    user_modifiedat: now,
                    user_isverify: 1
                },
                where: {
                    user_id: user.user_id,
                    user_email: user.user_email
                }
            });

            // If password is provided, update user's password
            if (password) {
                const hashedPassword = await hashPassword(password);
                const updatedUser = await prisma.user.update({
                    where: {
                        user_id: user.user_id
                    },
                    data: {
                        user_password: hashedPassword,
                        user_modifiedat: now
                    },
                    select: {
                        user_id: true,
                        user_email: true,
                        user_password: true
                    }
                });
                // Generate access token and set cookie
                const accessToken = generateToken(updatedUser)?.accessToken;
                return res.status(200)
                    .cookie("accessToken", accessToken, cookieOptions)
                    .json(new ApiResponse(200, "ForgetPassword: Success", { accessToken }));
            }

            // Return success response without cookies
            return res.status(200).json(new ApiResponse(200, "ForgetPassword: User Email Verified"));
        }

        // If user's email is not verified, return 402 status
        if (!user.user_isverify) {
            return res.status(402).json(new ApiResponse(402, "ForgetPassword: User's email is not verified"));
        }

        // Return success response without cookies
        return res.status(200).json(new ApiResponse(200, "ForgetPassword: Success"));

    } catch (err) {
        // If any error occurs, throw a 403 error with the error message
        throw new ApiError(403, err?.message || "ForgetPassword: Something went wrong");
    }
});
export const logout = asyncHandler(async (req, res) => {
    try {
        // Clear the access token cookie
const userId = req.user.user_id;
const findUser = await prisma.login.findFirst(
    {
        where:
        {
            user_user_id: userId
        }
    }
);


const login_status= await prisma.login.update(
    {
        where:
        {
         login_id: findUser.login_id
        },
        data:
        {
            login_isactive : 0
        }
    }
);
if(login_status)
{
       res.clearCookie("accessToken", cookieOptions);
}
        // Optionally, perform additional logout actions like updating user's login status
        // For example, if you have a field like `IsLogin` in your usersignin table, you might want to set it to false
        
        // Respond with a success message
        return res
            .status(200)
           .json(new ApiResponse(200, "Logout : You have been successfully logged out"));
    } catch (err) {
        // Handle errors
        throw new ApiError(403, err?.message || "Logout : Something went wrong during logout");
    }
});
