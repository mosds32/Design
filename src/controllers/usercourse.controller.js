import {prisma} from '../client/client.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const usercourse = asyncHandler(async(req, res, next) =>
{
try
{
const {courseId, course_date} = req.body;
const now = new Date();
const userId = req.user.user_id;
const userCourse = await prisma.usercourse.create(
    {
        data:
        {
            usercourse_date: course_date,
            course_course_id:parseInt(courseId),
            user_user_id: userId,
            usercourse_createdat: now,
            usercourse_modifiedat: now
        }
    }
);
if(userCourse)
{
return res.status(200).json(new ApiResponse(200, "User Course", userCourse));
}
}
catch(error)
{
    throw new ApiError(403, error?.message || "Error in user course");
}

});

export const getCourse = asyncHandler(async(req, res, next) =>
{
try
{
const findCourse = await prisma.usercourse.findMany(
    {
        where:
        {
            user_user_id: req.user.user_id
        }
    }
);
if(findCourse)
{
    return res.status(200).json(new ApiResponse(200, "Get Course", findCourse));
}
}
catch(error)
{
    throw new ApiError(403, error?.message || "Error in get course");
}


});
export const editcourse = asyncHandler(async(req, res, next)  =>
{
try
{
const usercourseId = req.params.usercourseId;
const now = new Date();
const {courseId, course_date}=req.body;
const courseFind = await prisma.usercourse.findFirst(
    {
        where:
        {
            usercourse_id: parseInt(usercourseId)
        }
    }
);
const updateCourse = await prisma.usercourse.update(
    {
        where:
        {
            usercourse_id: courseFind.usercourse_id,
            user_user_id: req.user.user_id
        },
        data:
        {
            course_course_id: courseId,
            usercourse_date: course_date,
            usercourse_createdat:now,
            usercourse_modifiedat:now,
            user_user_id: req.user.user_id
        }
    }
);
if(updateCourse)
{
    return res.status(200).json(new ApiResponse(200, "Course Edited", updateCourse));
}



}
catch(error)
{
    throw new ApiError(403, error?.message || "Error in Course Edit");
}



} )