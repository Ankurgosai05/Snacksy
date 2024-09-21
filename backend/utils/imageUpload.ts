import cloudinary from "./cloudinary";

const uploadImageOnCloudinary  = async (file:Express.Multer.File) =>{   // file:Express.Multer.File file no type 6 typescript ma
   
        const base64Image = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64Image}`; // file.minetype as png jpg
        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        return uploadResponse.secure_url;
};


export default uploadImageOnCloudinary;