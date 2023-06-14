type methods = 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';

export interface OptionRequest<M extends object> {
    method: methods;
    path: string;
    data?: M;
    queries?: Record<string, string>;
}
