import mongoose, {Schema, type InferSchemaType} from "mongoose";

const noteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            trim: true,
            default: ""
        },
        content: {
            type: String,
            default: "",
            required: true
        }
    },
    {
        timestamps: true,
    }
)

export type Note = InferSchemaType<typeof noteSchema>

export const NoteModel = mongoose.model("Note", noteSchema)