export interface IMaintenance {
    _id: string;
    standard: string[];
    createdAt: string;
    customerName: string;
    invoice: number;
    mrm: number;
    audit: number;
    doc: number;
    date: Date;
    isDeleted: boolean;
    proposalImageUrl?: string;
    quotationImageUrl?: string;
    remarks?: string;
}

export interface GetMaintenanceParams {
    index?: number;
    search?: string;
    dateFilter?: string;
    invoice?: number;
    audit?: number;
    mrm?: number;
    doc?: number;
}

export interface GetMaintenanceResponse {
    index: number;
    maxIndex: number;
    data: IGetMaintenance[];
}

export interface IGetMaintenance {
    id: string;
    standard: string[];
    createdAt: string;
    customerName: string;
    invoice: number;
    audit: number;
    mrm: number;
    doc: number;
}

export interface IServerMaintenance extends IMaintenance, Document {
    id: string;
}
