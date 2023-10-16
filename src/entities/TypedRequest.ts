import { Request } from 'express';

export interface ParamsDictionary {
    [key: string]: string;
}

export type TypedRequestQueryParams<T> = Request<unknown, unknown, unknown, T>;