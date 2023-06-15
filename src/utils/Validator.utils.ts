import { OnlyNumbersRegEx } from './RegEx.utils';

export const validateNumbers = async (value: string) => {
    if (value.trim() !== '') {
        if (!OnlyNumbersRegEx.test(value)) {
            throw new Error('Solo se aceptán números');
        }
    }
};
