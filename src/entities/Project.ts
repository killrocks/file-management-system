export interface IProject {
    _id: string;
    standard: string[];
    createdAt: string;
    customerName: string;
    contractAmount: number;
    date: Date;
    isDeleted: boolean;
    remarks?: string;
    quotationImageUrl?: string;
    proposalImageUrl?: string;
}
export interface IGetProject {
    id: string;
    standard: string[];
    createdAt: string;
    customerName: string;
    contractAmount: number;
    date: Date;
    proposalImageUrl?: string;
    quotationImageUrl?: string;
}

export interface CreateProjectParams {
    standard: string[];
    customerName: string;
    contractAmount: number;
    date: string;
    proposalImageUrl?: string;
    quotationImageUrl?: string;
}

export interface GetProjectParams {
    index?: number;
    search?: string;
    dateFilter?: string;
}

export interface GetProjectResponse {
    index: number;
    maxIndex: number;
    data: IGetProject[];
}

export interface DeleteProjectParams {
    id: string;
}
export interface IServerProject extends IProject, Document {
    _id: string;
}
