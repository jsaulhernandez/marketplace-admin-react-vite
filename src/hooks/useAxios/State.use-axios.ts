import { Pagination } from './Response.use-axios';

export interface StateResponse<M extends object> {
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    message: string;
    data?: M;
    page?: Pagination;
}
