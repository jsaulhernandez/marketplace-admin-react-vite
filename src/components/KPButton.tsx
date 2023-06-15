import { FC, ReactNode } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { TypeButton } from '@constants/Constants.constants';

export interface KPButtonProps {
    theme?: 'dark' | 'light';
    type: TypeButton;
    isSmall?: boolean;
    children?: ReactNode;
    prefix?: ReactNode;
    suffix?: ReactNode;
    onClick?: () => void;
    htmlType?: 'submit' | 'button' | 'reset';
    disabled?: boolean;
    className?: string;
    loading?: boolean;
}

const KPButton: FC<KPButtonProps> = ({ theme = 'light', disabled = false, ...props }) => {
    return (
        <Button
            disabled={disabled}
            isSmall={props.isSmall}
            isChildren={props.children ? true : false}
            className={`flex items-center justify-center ${props.className ?? ''} ${
                props.type
            }-${theme}`}
            onClick={() => props.onClick && props.onClick()}
        >
            <div className="KPButton_content flex items-center">
                {props.prefix && (
                    <div className="KPButton_content-prefix">{props.prefix}</div>
                )}
                {props.children}
                {props.suffix ||
                    (props.loading && (
                        <div className="KPButton_content-suffix">
                            {props.loading ? <LoadingOutlined /> : props.suffix}
                        </div>
                    ))}
            </div>
        </Button>
    );
};

const Button = styled.button<{
    isSmall?: boolean;
    isChildren?: boolean;
}>`
    font-style: normal;
    font-weight: 500 !important;
    font-size: ${({ isSmall }) => (isSmall ? '11px' : '15px')};
    padding: ${({ isSmall }) => (isSmall ? '6px 10px' : '12px 16px')};
    line-height: 12px;
    border-radius: 10px;
    outline: none;
    border: none;

    &:hover {
        cursor: pointer;
    }

    .KPButton_content {
        z-index: 2;
        transition: all 0.2s;
    }

    .KPButton_content-prefix {
        transition: all 0.2s;
        margin-right: ${({ isChildren }) => (isChildren ? '5px' : '0px')};
    }

    .KPButton_content-suffix {
        transition: all 0.2s;
        margin-left: ${({ isChildren }) => (isChildren ? '5px' : '0px')};
    }

    &.primary-light {
        background-color: var(--primary-color);
        color: var(--secondary-color);

        &:hover {
            background-color: #1c79f3;
        }

        &:active {
            background-color: var(--primary-color);
        }
    }

    &.primary-dark {
        background-color: transparent;
        border: 2px solid var(--primary-color);
        color: var(--primary-color);

        &:hover {
            background-color: var(--primary-color);
            color: var(--secondary-color);
        }

        &:active {
            background-color: transparent;
            color: var(--primary-color);
        }
    }

    &.secondary-light {
        background-color: #e6effc;
        color: var(--primary-color);

        &:hover {
            background-color: #eff4fb;
        }

        &:active {
            background-color: #e6effc;
        }
    }

    &.secondary-dark {
        border: 2px solid #e6effc;
        background-color: transparent;
        color: #e6effc;

        &:hover {
            background-color: #eff4fb;
        }

        &:active {
            background-color: transparent;
        }
    }

    &.link-light {
        background-color: transparent;
        color: var(--primary-color);

        &:hover {
            color: #0259ca;
        }

        &:active {
            color: var(--primary-color);
        }
    }

    &.link-dark {
        background-color: transparent;
        color: var(--secondary-color);

        &:hover {
            color: #efebeb;
        }

        &:active {
            color: var(--secondary-color);
        }
    }

    &.danger-light {
        background-color: #e64547;
        color: var(--secondary-color);

        &:hover {
            background-color: #ea5456;
        }

        &:active {
            background-color: #e64547;
        }
    }

    &.danger-dark {
        border: 2px solid #e64547;
        background-color: transparent;
        color: #e64547;

        &:hover {
            color: var(--secondary-color);
            background-color: #e64547;
        }

        &:active {
            background-color: transparent;
            color: #e64547;
        }
    }

    &.primary-light,
    &.primary-dark,
    &.secondary-light,
    &.secondary-dark,
    &.link-light,
    &.link-dark,
    &.danger-light,
    &.danger-dark {
        transition: all 0.1s ease-in-out;
        position: relative;

        &:disabled {
            background-color: #eeeeee;
            color: var(--secondary-color);
            cursor: default;
            border: none;
        }
    }
`;

export default KPButton;
