import {Schema, model, models} from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: "string",
            required: true
        },
        email: {
            type: "string",
            required: true,
            unique: true
        },
        password: {
            type: "string",
            required: true
        },
        role: {
            type: "string",
            enum: ["Admin", "Faculty", "Chairperson"]
        }
    },
        {
            timestamps: true
        }
)

const User = models.User || model("User", UserSchema);

export default User;