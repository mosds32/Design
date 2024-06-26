import {prisma} from '../client/client.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const addreviews = asyncHandler(async (req, res, next) => {
    try {
        // Extracting necessary data from the request body
        const { text, like, rate, courseId } = req.body;
        const now = new Date();

        // Creating a new review using Prisma's create method
        const reviews = await prisma.reviews.create({
            data: {
                reviews_text: text,
                reviews_like: parseInt(like),
                reviews_rate: parseInt(rate),
                course_course_id: parseInt(courseId),
                reviews_createdat: now,
                reviews_modifiedat: now,
                user_user_id: req.user.user_id
            }
        });

        // If the review is created successfully, return a success response
        if (reviews) {
            return res.status(200).json(new ApiResponse(200, "Review Added", reviews));
        }
    } catch (error) {
        // If an error occurs during the process, throw an ApiError
        throw new ApiError(403, error?.message || "Error in Reviews");
    }
});
export const getReviews = asyncHandler(async(req, res, next) =>
{
    try
    {
const getReviews = await prisma.reviews.findMany(
    {
        where:
        {
            user_user_id: req.user_user_id
        }
    }
);
if(getReviews)
{
    return res.status(200).json(new ApiResponse(200, "Get Reviews", getReviews));
}
    }
    catch(error)
    {
        throw new ApiError(403, error?.message || "Error in Reviews");
    }
    
});
export const editReview = asyncHandler(async(req, res, next) =>
{
    try
    {
      const reviewId = req.params.reviewId;
      const {text, like, rate, courseId} = req.body;
      const now = new Date();
const reviewFind = await prisma.reviews.findFirst(
    {
        where:
        {
            reviews_id: parseInt(reviewId),
          user_user_id: req.user.user_id
        }
    }
);
if(!reviewFind)
{
    return res.status(202).json(new ApiResponse(202,"Review Text not found"));
}
const Updates = await prisma.reviews.update(
    {
        data:
        {
            reviews_text: text,
            reviews_like: like,
            reviews_rate: rate,
            course_course_id: parseInt(courseId),
            reviews_modifiedat: now
        },
        where:
        {
            reviews_id: reviewFind.reviews_id
        }
    }
);
if(Updates)
{
    return res.status(201).json(new ApiResponse(201, "Updated", Updates));
}


    }
    catch(error)
    {
throw new ApiError(403, error?.message || "Review Edited");
    }
});