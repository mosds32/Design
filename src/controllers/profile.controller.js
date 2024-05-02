import {prisma} from '../client/client.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteFile } from '../utils/file.js';
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const addProfile = asyncHandler(async(req, res, next) =>
{
    try
    {
const {name, dob} = req.body;
const now = new Date();
const imgPah = "/uploads/images/" + req.file.filename;
const createProfile = await prisma.profile.create(
    {
        data:
        {
            profile_name: name,
            profile_dob:dob,
            profile_createdat: now,
            profile_modifiedat: now,
            profile_img: imgPah,
            user_user_id: req.user.user_id
        }
    }
);
if(createProfile)
{
return res.status(201).json(new ApiResponse(201, "Profile Created", createProfile));

}
    }
    catch(error)
    {
        throw new ApiError(403, error?.message || "Error in creation");
    }

}  );
export const updateProfile = asyncHandler(async (req, res, next) => {
    try {
        const { name, dob } = req.body;
        const now = new Date();
        
        let imagePah = null;
        if (req.file) {
            imagePah = "/uploads/images/" + req.file.filename;
        }
        
        const findUser = await prisma.profile.findFirst({
            where: {
                user_user_id: req.user.user_id
            }
        });
        
        if (!findUser) {
            throw new ApiError(404, "Profile not found");
        }

        // Delete the old image if a new image is provided
        if (req.file && findUser.profile_img) {
            await deleteFile(__dirname, findUser.profile_img);

        }

        const updateData = {
            profile_name: name,
            profile_dob: dob,
            profile_modifiedat: now,
            user_user_id: req.user.user_id
        };

        if (imagePah) {
            updateData.profile_img = imagePah;
        }

        const updateUser = await prisma.profile.update({
            where: {
                profile_id: findUser.profile_id
            },
            data: updateData
        });

        if (updateUser) {
            return res.status(200).json(new ApiResponse(200, "Profile updated successfully", updateUser));
        }
    } catch (error) {
        throw new ApiError(403, error?.message || "Error in updating profile");
    }
});
export const getProfile = asyncHandler(async(req, res, next)  =>
{
    try
    {
    const FindUser = await prisma.profile.findMany(
        {
            where:
            {
                user_user_id: req.user.user_id
            }
        }
    );
    if(FindUser)
    {
        return res.status(200).json(new ApiResponse(200, "Fetch Profile", FindUser));
    }
    }
    catch(error)
    {
        throw new ApiError(403, error?.message || "Error in Fetching Profile" );
    }
} )


