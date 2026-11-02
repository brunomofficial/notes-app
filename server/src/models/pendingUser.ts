import mongoose, { Schema, type InferSchemaType } from "mongoose";

const pendingUserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        verificationCode: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600, // 10 minutes
        }
    }
)

export type PendingUser = InferSchemaType<typeof pendingUserSchema>

export const PendingUserModel = mongoose.model("PendingUser", pendingUserSchema);