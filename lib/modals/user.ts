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
        contact: {
            type: "string",
            required: true
        },
        role: {
            type: "string",
            enum: ["Admin", "Faculty", "Chairperson"]
        },
        department: {
            type: "string",
            enum: ["Department of Education", "Department of Information Technology"]
        },
        sex: {
            type: "string",
            enum: ["Male", "Female"]
        }
    },
        {
            timestamps: true
        }
)

const User = models.User || model("User", UserSchema);

export default User;