import {z} from "zod";

export const menuSchema = z.object({
    _id: z.string().optional(), // Add the optional _id field
    name:z.string().nonempty({message:"Name is required"}),
    description:z.string().nonempty({message:"description is required"}),
    price:z.number().min(0,{message:"Price can not be negative"}),
    image:z.instanceof(File).optional().refine((file) => file?.size !== 0, {message:"Image file is required"}),
});
export type MenuFormSchema = z.infer<typeof menuSchema>;