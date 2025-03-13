import mongoose, { model, models, Schema } from "mongoose";

export interface User {
    _id?: mongoose.Types.ObjectId;
    clerkId: string;
    name: string;
    // bannerUrl: string;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<User>({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    // bannerUrl: {
    //     type: String,
    //     required: true,
    // },
    imageUrl: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});


const User = models?.User || model<User>("User",userSchema);
export default User;
