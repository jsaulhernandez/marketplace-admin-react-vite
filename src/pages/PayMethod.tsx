import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';

import useAxios from '@hooks/useAxios.hook';

import { PayMethodModel } from '@interfaces/PayMethod.model';

const PayMethod = () => {
    const [statePayMethod, fetchPayMethod] = useAxios<PayMethodModel[]>();
    const [stateDelete, fetchDelete] = useAxios<PayMethodModel>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getPayMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPayMethods = (page = '1', filter = '') => {
        fetchPayMethod({
            method: 'GET',
            path: '/pay-method',
            queries: {
                page,
                filter,
                size: '10',
            },
        });
    };

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const columns: ColumnType<any>[] = [
        {
            title: 'Nombre',
            dataIndex: 'name',
        },
        {
            title: 'Estado',
            render: (_, record: PayMethodModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: PayMethodModel) => (
                <KPActions
                    onEdit={() => onEdit(record)}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getPayMethods(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getPayMethods('1', e.target.value);
    };

    const onChangeStatus = async (record: PayMethodModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchDelete({
            method: 'PATCH',
            data: record,
            path: `/pay-method/${record.id}`,
        });

        if (response.isSuccess) getPayMethods(page.toString(), filter);
    };

    const onEdit = (record: PayMethodModel) => {
        console.log('onEdit', record);
    };
    const onRemove = (record: PayMethodModel) => {
        console.log('onRemove', record);
    };

    return (
        <KPTable
            rowKey={'id'}
            scroll={{ x: 600 }}
            columns={columns}
            dataSource={statePayMethod.data}
            loading={statePayMethod.isLoading || stateDelete.isLoading}
            pagination={{
                current: statePayMethod.page?.page,
                total: statePayMethod.page?.pageCount,
                pageSize: statePayMethod.page?.size,
                onChange: onChangePagination,
            }}
            hasPreviousPage={statePayMethod.page?.hasPreviousPage}
            hasNextPage={statePayMethod.page?.hasNextPage}
            filterForm={
                <Wrapper className="flex justify-between">
                    <KPInput
                        className="PayMethod_input"
                        addonBefore={<SearchOutlined />}
                        onChange={onSearch}
                        placeholder="Buscar....."
                        height={40}
                    />
                    <KPButton type="primary" suffix={<PlusOutlined />}>
                        Agregar
                    </KPButton>
                </Wrapper>
            }
        />
    );
};

const Wrapper = styled.div`
    .PayMethod_input {
        max-width: 250px;
    }
`;

export default PayMethod;
