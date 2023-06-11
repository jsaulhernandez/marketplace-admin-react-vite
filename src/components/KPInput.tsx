import { ChangeEvent, FC, ReactNode } from 'react';

import { Input } from 'antd';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';

export type TypeInput = 'input' | 'textarea';

export interface KPInputProps {
    typeInput?: TypeInput;
    addonAfter?: ReactNode;
    addonBefore?: ReactNode;
    prefix?: ReactNode;
    suffix?: ReactNode;
    height?: number;
    placeholder?: string;
    className?: string;
    onChange?: (value: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    defaultValue?: string | number | ReadonlyArray<string>;
    value?: string | number | ReadonlyArray<string>;
}

const KPInput: FC<KPInputProps> = (props) => {
    const {
        typeInput,
        addonAfter,
        addonBefore,
        prefix,
        suffix,
        onChange,
        className,
        ...rest
    } = props;

    if (typeInput === 'textarea')
        return (
            <TextArea
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    onChange && onChange(e)
                }
                className={`${className ? className : ''}`}
                allowClear={false}
                {...rest}
            />
        );

    return (
        <InputWrapper
            onChange={(e) => onChange && onChange(e)}
            className={`${className ? className : ''}`}
            addonAfter={addonAfter}
            addonBefore={addonBefore}
            prefix={prefix}
            suffix={suffix}
            {...rest}
        />
    );
};

const getHeight = (height?: number) => {
    if (height) return `${height}px`;
    return 'auto';
};

const InputWrapper = styled(Input)<{
    height?: number;
}>`
    height: ${({ height }) => getHeight(height)};
`;

export default KPInput;
