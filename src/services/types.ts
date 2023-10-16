export enum ServiceResponseStatus {
    Error,
    Success,
}

export type ServiceResponseSuccess<T> = {
    status: ServiceResponseStatus.Success,
    data: T
};

export type ServiceResponseError = {
    status: ServiceResponseStatus.Error,
    data: {
        code?: number,
        error: string,
    }
};

export type ServiceResponse<Data> = Promise<ServiceResponseSuccess<Data> | ServiceResponseError>;
