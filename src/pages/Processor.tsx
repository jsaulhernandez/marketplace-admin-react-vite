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

import { ProcessorModel } from '@interfaces/Processor.model';

const Processor = () => {
    const [stateProcessor, fetchProcessor] = useAxios<ProcessorModel[]>();
    const [stateDelete, fetchDelete] = useAxios<ProcessorModel>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getProcessors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getProcessors = (page = '1', filter = '') => {
        fetchProcessor({
            method: 'GET',
            path: '/processor',
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
            render: (_, record: ProcessorModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: ProcessorModel) => (
                <KPActions
                    onEdit={() => onEdit(record)}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getProcessors(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getProcessors('1', e.target.value);
    };

    const onChangeStatus = async (record: ProcessorModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchDelete({
            method: 'PATCH',
            data: record,
            path: `/processor/${record.id}`,
        });

        if (response.isSuccess) getProcessors(page.toString(), filter);
    };

    const onEdit = (record: ProcessorModel) => {
        console.log('onEdit', record);
    };
    const onRemove = (record: ProcessorModel) => {
        console.log('onRemove', record);
    };

    return (
        <KPTable
            rowKey={'id'}
            scroll={{ x: 600 }}
            columns={columns}
            dataSource={stateProcessor.data}
            loading={stateProcessor.isLoading || stateDelete.isLoading}
            pagination={{
                current: stateProcessor.page?.page,
                total: stateProcessor.page?.pageCount,
                pageSize: stateProcessor.page?.size,
                onChange: onChangePagination,
            }}
            hasPreviousPage={stateProcessor.page?.hasPreviousPage}
            hasNextPage={stateProcessor.page?.hasNextPage}
            filterForm={
                <Wrapper className="flex justify-between">
                    <KPInput
                        className="Processor_input"
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
    .Processor_input {
        max-width: 250px;
    }
`;

export default Processor;
