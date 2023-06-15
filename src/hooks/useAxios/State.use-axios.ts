/* eslint-disable @typescript-eslint/ban-types */
import { Pagination } from './Response.use-axios';

export interface StateResponse<M extends Object> {
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    message: string;
    data?: M;
    page?: Pagination;
}
