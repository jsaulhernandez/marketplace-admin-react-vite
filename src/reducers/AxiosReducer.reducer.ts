import { ActionReducer } from '@hooks/useAxios/Action.use-axios';
import { StateResponse } from '@hooks/useAxios/State.use-axios';

const axiosReducer = <M extends object>(
    state: StateResponse<M>,
    action: ActionReducer<M>,
): StateResponse<M> => {
    switch (action.type) {
        case 'INIT':
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false,
            };

        case 'SUCCESS':
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                message: action.payload?.message ?? '',
                data: action.payload?.data?.data ?? state.data,
                page: action.payload?.data?.page ?? state.page,
            };

        case 'ERROR':
            return {
                ...state,
                isLoading: false,
                isSuccess: false,
                isError: true,
                message: action.payload?.message ?? '',
                data: action.payload?.data?.data ?? state.data,
                page: action.payload?.data?.page ?? state.page,
            };
        default:
            return {
                ...state,
            };
    }
};

export default axiosReducer;
