import mongoose from 'mongoose';

import { IMaintenance } from 'entities/Maintenance';

const MaintenanceSchema = new mongoose.Schema<IMaintenance>({
    standard: {
        type: [String],
        required: true,
    },

    customerName: {
        type: String,
        required: true,
    },

    invoice: {
        type: Number,
        required: true,
    },

    mrm: {
        type: Number,
        required: true,
    },

    audit: {
        type: Number,
        required: true,
    },

    doc: {
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

export default mongoose.models.Maintenance || mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
