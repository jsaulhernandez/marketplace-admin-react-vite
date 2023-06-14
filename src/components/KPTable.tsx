import { FC, ReactNode } from 'react';

import { Table, TableProps } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPButton from './KPButton';
import KPText from './KPText';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface KPTableProps extends TableProps<Record<string, any>> {
    filterForm?: ReactNode;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
}

const KPTable: FC<KPTableProps> = (props) => {
    const { pagination, filterForm, hasPreviousPage, hasNextPage, ...args } = props;

    const getPaginationInformation = (): string => {
        if (!pagination) return '0 de 0';
        if (pagination.total === 0) return '0 de 0';

        return `${pagination.current ?? 0} de ${pagination.total ?? 0}`;
    };

    const onChangePagination = (action: 'up' | 'down') => {
        if (!pagination) return;
        const { onChange, pageSize, current } = pagination;

        if (!pageSize) return;
        if (typeof current !== 'number') return;
        if (onChange && action === 'up') onChange(current + 1, pageSize);
        if (onChange && action === 'down') onChange(current - 1, pageSize);
    };

    return (
        <Wrapper>
            <div className="KPTable_content">
                {filterForm && filterForm}
                <CustomTable
                    className={`${filterForm ? 'mt-2' : ''}`}
                    {...args}
                    pagination={false}
                />
            </div>
            <div className="KPTable_pagination flex flex-wrap justify-center items-center g-10">
                <KPButton
                    type="link"
                    prefix={<LeftOutlined className="icon" />}
                    disabled={!hasPreviousPage}
                    onClick={() => onChangePagination('down')}
                />
                <KPText text={`Página ${getPaginationInformation()}`} />
                <KPButton
                    type="link"
                    suffix={<RightOutlined className="icon" />}
                    disabled={!hasNextPage}
                    onClick={() => onChangePagination('up')}
                />
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    background-color: var(--secondary-color);
    padding: 24px;
    border-radius: 10px;
    box-shadow: 0px 0px 20px rgba(17, 17, 17, 0.07);
    -webkit-box-shadow: 0px 0px 20px rgba(17, 17, 17, 0.07);
    -moz-box-shadow: 0px 0px 20px rgba(17, 17, 17, 0.07);

    .KPTable_pagination {
        padding: 12px;
        border: 2px solid var(--quaternary-color);
        border-top: 0px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        button {
            &:disabled {
                background-color: transparent;

                .icon {
                    color: var(--secondary-text-color);

                    &:hover {
                        transform: scale(1.2);
                    }
                }
            }
        }

        button .icon {
            transform: scale(1.2);

            &:hover {
                transform: scale(1.4);
            }
        }
    }

    @media screen and (max-width: 410px) {
        .KPTable_pagination {
            justify-content: center;
            flex-direction: column;
        }
    }
`;

const CustomTable = styled(Table)`
    border: 2px solid var(--quaternary-color);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    .ant-table-thead tr th {
        background: var(--tertiary-color);
        color: var(--secondary-text-color);
        border-bottom: 2px solid var(--quaternary-color);
        padding: 10px 16px;

        &::before {
            background-color: transparent !important;
        }
    }

    .ant-table-tbody > tr.ant-table-row:hover > td {
        background-color: #e6effc;
    }
`;

export default KPTable;
