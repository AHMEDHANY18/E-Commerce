import cloudinary from "./cloudniary.js"



export const deleteFromCloudinary = async (req, res, next) => {
    if (req?.filePath) {
        await cloudinary.api.delete_resources_by_prefix(req.filePath)
        await cloudinary.api.delete_folder(req.filePath)
    }
    next()
}



export default deleteFromCloudinary