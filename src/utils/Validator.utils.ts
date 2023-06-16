import { OnlyDecimalsNumberSRegEx, OnlyNumbersRegEx } from './RegEx.utils';

export const validateNumbers = async (value: string) => {
    if (value && value.trim() !== '') {
        if (!OnlyNumbersRegEx.test(value)) {
            throw new Error('Solo se aceptán números');
        }
    }
};

export const validateDecimalNumbers = async (value: string) => {
    if (value && value.trim() !== '') {
        if (!OnlyDecimalsNumberSRegEx.test(value)) {
            throw new Error('Solo se aceptán números');
        }
    }
};
