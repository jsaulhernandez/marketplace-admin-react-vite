import { useReducer } from 'react';
import axios from 'axios';

import {
    ResponseApi,
    ReturnDefaultData,
    ReturnMethod,
} from './useAxios/Response.use-axios';
import { StateResponse } from './useAxios/State.use-axios';

import { OptionRequest } from './useAxios/OptionRequest.use-axios';
import AxiosReducer from '@reducers/AxiosReducer.reducer';
import { API_URL } from '@constants/Constants.constants';

// eslint-disable-next-line @typescript-eslint/ban-types
const useAxios = <M extends Object>(): ReturnMethod<M> => {
    const initial: StateResponse<M> = {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
        data: undefined,
        page: undefined,
    };

    const [state, dispatch] = useReducer(AxiosReducer<M>, initial);

    const fetchApi = async (
        request: OptionRequest<M> | string,
    ): Promise<ReturnDefaultData<M>> => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let response: ResponseApi<M>;
        const url = API_URL;

        try {
            dispatch({ type: 'INIT' });
            //Si la url es string será una petición get directa
            if (typeof request === 'string') {
                const responseAxios = await axios.get(`${url}${request}`, {
                    method: 'GET',
                    headers: Object.fromEntries(headers),
                });

                response = responseAxios.data;
            } else {
                //Si vienen definidos parametros, la petición puede ser POST, PUT, GET O DELETE
                if (['PUT', 'PATCH', 'POST'].includes(request.method)) {
                    const responseAxios = await axios(`${url}${request.path}`, {
                        method: request.method,
                        headers: Object.fromEntries(headers),
                        data: request.data ?? {},
                    });

                    response = responseAxios.data;
                } else {
                    const queries = request.queries
                        ? `?${new URLSearchParams(request.queries)}`
                        : '';

                    const responseAxios = await axios(`${url}${request.path}${queries}`, {
                        method: request.method,
                        headers: Object.fromEntries(headers),
                    });

                    response = responseAxios.data;
                }
            }

            if ([200, 201].includes(response.statusCode)) {
                dispatch({
                    type: 'SUCCESS',
                    payload: {
                        data: {
                            data: response.response.data,
                            page: response.response.page,
                        },
                        message: response.message,
                    },
                });

                return {
                    isSuccess: true,
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.response.data,
                    page: response.response.page,
                };
            } else {
                dispatch({
                    type: 'ERROR',
                    payload: {
                        data: {
                            data: response.response.data,
                            page: response.response.page,
                        },
                        message: response.message,
                    },
                });

                return {
                    isSuccess: false,
                    statusCode: response.statusCode,
                    message: response.message,
                    data: response.response.data,
                    page: response.response.page,
                };
            }
        } catch (error) {
            console.log('[useAxios] [ERROR]', error);

            dispatch({
                type: 'ERROR',
                payload: {
                    message: 'Algo salio mal, vuelve a intentar más tarde',
                },
            });

            return {
                data: null,
                isSuccess: false,
                page: null,
            };
        }
    };

    return [state, fetchApi];
};

export default useAxios;
