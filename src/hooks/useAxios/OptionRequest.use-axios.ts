type methods = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface OptionRequest<M extends Object> {
    method: methods;
    path: string;
    data?: M;
    queries?: Record<string, string>;
}
