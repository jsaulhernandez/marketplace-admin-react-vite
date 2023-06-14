type methods = 'POST' | 'UPDATE' | 'DELETE' | 'GET';

export interface OptionRequest<M extends object> {
    method: methods;
    path: string;
    data?: M;
    queries?: Record<string, string>;
}
