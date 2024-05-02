import {prisma} from '../client/client.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const addUserTrainer = asyncHandler(async(req, res, next) =>
{
try
{
 const {trainerId, trainerDate} = req.body;
 const now = new Date();
 const selectTrainer = await prisma.usertrainer.create(
    {
        data:
        {
            trainer_trainer_id: trainerId,
            usertrainer_date: trainerDate,
            user_user_id: req.user.user_id,
            usertrainer_createdat:now,
            usertrainer_modifiedat: now
        }
    }
 );
 if(trainerDate)
 {
    return res.status(200).json(new ApiResponse(200, "Selected ", selectTrainer));
 }
}
catch(error)
{
    throw new ApiError(403, error?.message || "Error in Trainer");
}
});

export const getUserTrainer = asyncHandler(async(req, res, next) =>
{
    try
    {
const getTrainer = await prisma.usertrainer.findMany(
    {
        where:
        {
            user_user_id: req.user.user_id
        }
    }
);
if(getTrainer)
{
    return res.status(200).json(new ApiResponse(200, "Trainers ", getTrainer));
}
    }
    catch(error)
    {
        throw new ApiError(403, error?.message || "Error in getting trainer"  );
    }
} );

export const EditTrainer = asyncHandler(async(req, res, next) =>
{
try
{
    const {trainerId, trainerDate} = req.body;
const usertrainer_id =parseInt(req.params.usertrainer_id);
const now = new Date();
const user_trainerFinder = await prisma.usertrainer.findFirst(
    {
        where:
        {
            usertrainer_id: usertrainer_id
        }
    }
);
if(!user_trainerFinder)
{
    return res.status(200).json(new ApiResponse(200, "Not Trainer Exist", user_trainerFinder));
}
const UpdateUserTrainer = await prisma.usertrainer.update(
    {
        where:
        {
            usertrainer_id: usertrainer_id,
            user_user_id: req.user.user_id
        },
        data:
        {
          trainer_trainer_id: trainerId,
          usertrainer_date: trainerDate,
          usertrainer_createdat: now,
          usertrainer_modifiedat: now,
          user_user_id: req.user.user_id
        }
    }
);
if(UpdateUserTrainer)
{
    return res.status(200).json(new ApiResponse(200, "Get Edited", UpdateUserTrainer));
}
}
catch(error)
{
    throw new ApiError(403, error?.message || "Error in Trainer Editing")
}

});