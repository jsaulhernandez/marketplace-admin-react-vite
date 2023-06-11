import { OptionRequest } from './OptionRequest.use-axios';
import { StateResponse } from './State.use-axios';

export interface Pagination {
    page: number;
    size: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Content<M extends Record<string, unknown>> {
    data: M | null;
    page: Pagination | null;
}

export interface ResponseApi<M extends Record<string, unknown>> {
    status: string;
    statusCode: number;
    message: string;
    response: Content<M>;
}

export interface ReturnDefaultData<M extends Record<string, unknown>> extends Content<M> {
    statusCode?: number;
    message?: string;
    isSuccess: boolean;
}

export type ReturnMethod<M extends Record<string, unknown>> = [
    StateResponse<M>,
    (config: OptionRequest<M> | string) => Promise<ReturnDefaultData<M>>,
];
