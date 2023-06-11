import { Pagination } from './Response.use-axios';

export interface StateResponse<M extends Record<string, unknown>> {
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    message: string;
    data: M | null;
    page: Pagination | null;
}
