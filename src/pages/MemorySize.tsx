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

import { MemorySizeModel } from '@interfaces/MemorySize.model';

const MemorySize = () => {
    const [stateMemorySize, fetchMemorySize] = useAxios<MemorySizeModel[]>();
    const [stateDelete, fetchDelete] = useAxios<MemorySizeModel>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getMemoriesSizes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getMemoriesSizes = (page = '1', filter = '') => {
        fetchMemorySize({
            method: 'GET',
            path: '/memory-size',
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
            title: 'Tamaño de memoria',
            dataIndex: 'value',
        },
        {
            title: 'Estado',
            render: (_, record: MemorySizeModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: MemorySizeModel) => (
                <KPActions
                    onEdit={() => onEdit(record)}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getMemoriesSizes(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getMemoriesSizes('1', e.target.value);
    };

    const onChangeStatus = async (record: MemorySizeModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchDelete({
            method: 'PATCH',
            data: record,
            path: `/memory-size/${record.id}`,
        });

        if (response.isSuccess) getMemoriesSizes(page.toString(), filter);
    };

    const onEdit = (record: MemorySizeModel) => {
        console.log('onEdit', record);
    };
    const onRemove = (record: MemorySizeModel) => {
        console.log('onRemove', record);
    };

    return (
        <KPTable
            rowKey={'id'}
            scroll={{ x: 600 }}
            columns={columns}
            dataSource={stateMemorySize.data}
            loading={stateMemorySize.isLoading || stateDelete.isLoading}
            pagination={{
                current: stateMemorySize.page?.page,
                total: stateMemorySize.page?.pageCount,
                pageSize: stateMemorySize.page?.size,
                onChange: onChangePagination,
            }}
            hasPreviousPage={stateMemorySize.page?.hasPreviousPage}
            hasNextPage={stateMemorySize.page?.hasNextPage}
            filterForm={
                <Wrapper className="flex justify-between">
                    <KPInput
                        className="MemorySize_input"
                        addonBefore={<SearchOutlined />}
                        onChange={onSearch}
                        placeholder="Buscar....."
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
    .MemorySize_input {
        max-width: 250px;
    }
`;

export default MemorySize;
