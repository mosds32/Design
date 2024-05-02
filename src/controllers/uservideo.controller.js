import {prisma} from '../client/client.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const addVideoController = asyncHandler(async(req, res, next) =>
{
try
{
const {video_id, video_date}=req.body;
const now = new Date();
const user_video = await prisma.uservideo.create(
    {
        data:
        {
            video_video_id: video_id,
            uservideo_date: video_date,
            user_user_id: req.user.user_id,
            uservideo_createdat: now,
            uservideo_modifiedat: now
        }
    }
);
if(user_video)
{
    return res.status(200).json(new ApiResponse(200, "Added User Video", user_video));
}
}
catch(error)
{
    throw new ApiError(403, error?.message || "Error in Get Video");
}

} );

export const getUserVideosController = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve user videos associated with the logged-in user
        const user_videos = await prisma.uservideo.findMany({
            where: {
                user_user_id: req.user.user_id // Assuming req.user.user_id contains the user's ID
            }
        });

        // If user_videos are found, return a success response
        if (user_videos) {
            return res.status(200).json(new ApiResponse(200, "User Videos Found", user_videos));
        } else {
            // If no user videos are found, return a not found response
            return res.status(404).json(new ApiResponse(404, "No User Videos Found"));
        }
    } catch (error) {
        // If an error occurs during the process, throw an ApiError
        throw new ApiError(403, error?.message || "Error in Retrieving User Videos");
    }
});
export const getEditVideoControll = asyncHandler(async(req, res, next) =>
{
try
{
const uservideo_id = req.params.uservideo_id;
const now = new Date();
const {video_id, video_date}=req.body;
const findVideo = await prisma.uservideo.findFirst(
    {
        where:
        {
            uservideo_id:parseInt(uservideo_id),
        }
    }
);
const updateVideo = await prisma.uservideo.update(
    {
        where:
        {
            uservideo_id: findVideo.uservideo_id,
            user_user_id: req.user.user_id
        },
        data:
        {
           video_video_id: video_id,
           uservideo_date: video_date,
           uservideo_createdat: now,
           uservideo_modifiedat: now,
           user_user_id:req.user.user_id
        }
    }
);
if(updateVideo)
{
    return res.status(200).json(new ApiResponse(200, "update video", updateVideo));
}
}
catch(error)
{
    throw new ApiError(403, error?.message || "Error in Editing Video");
}


});
