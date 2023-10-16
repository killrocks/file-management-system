import mongoose from 'mongoose';

import { IServerProject } from 'entities/Project';

const ProjectSchema = new mongoose.Schema<IServerProject>({
    standard: {
        type: [String],
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    contractAmount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    proposalImageUrl: {
        type: String,
    },
    quotationImageUrl: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    remarks: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Project || mongoose.model<IServerProject>('Project', ProjectSchema);
