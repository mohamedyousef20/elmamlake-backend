import expressAsyncHandler from "express-async-handler";

export const updateOne = (modelName) =>
    expressAsyncHandler(async (req, res, next) => {
        console.log('from update function',req.body)
        const updateOne = await modelName.findByIdAndUpdate(
            { _id: req.body.id },

            req.body,

            { new: true }
        );
        if (!updateOne) {
            return next(new createError(`No documents Found TO Update`, 404))
        }

        // trigger save event in Review model 
        updateOne.save();
        res.status(200).json({ msg: 'success', data: updateOne });
    });
export const deleteOne = (modelName) =>
    expressAsyncHandler(async (req, res, next) => {
        console.log('Im In Delete Function ')
        console.log('Im In Delete Function ')
        const { id } = req.body;
        const deletedOne = await modelName.findByIdAndDelete(id);
        if (!deletedOne) {
            return next(new createError(`No Document Found To Delete`, 404));
        }
        //  trigger remove event in Review model
        deletedOne.deleteOne();
        res.status(200).send(`Success Deleting of Document`);
    });
