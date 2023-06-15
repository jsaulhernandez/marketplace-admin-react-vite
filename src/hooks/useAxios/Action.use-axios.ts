import { Content } from './Response.use-axios';

type actions = 'INIT' | 'SUCCESS' | 'ERROR';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ActionReducer<M extends Object> {
    type: actions;
    payload?: {
        message?: string;
        data?: Content<M> | null;
    };
}
