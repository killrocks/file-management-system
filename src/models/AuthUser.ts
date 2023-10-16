import mongoose from 'mongoose';

import { IAuthUser } from 'entities/AuthUser';

const AuthUserSchema = new mongoose.Schema<IAuthUser>({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.AuthUser || mongoose.model<IAuthUser>('AuthUser', AuthUserSchema);
