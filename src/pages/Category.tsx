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

import { CategoryModel } from '@interfaces/Category.model';

const Category = () => {
    const [stateCategories, fetchCategories] = useAxios<CategoryModel[]>();
    const [stateDelete, fetchDelete] = useAxios<CategoryModel>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCategories = (page = '1', filter = '') => {
        fetchCategories({
            method: 'GET',
            path: '/category',
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
            render: (_, record: CategoryModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: CategoryModel) => (
                <KPActions
                    onEdit={() => onEdit(record)}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getCategories(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getCategories('1', e.target.value);
    };

    const onChangeStatus = async (record: CategoryModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchDelete({
            method: 'PATCH',
            data: record,
            path: `/category/${record.id}`,
        });

        if (response.isSuccess) getCategories(page.toString(), filter);
    };

    const onEdit = (record: CategoryModel) => {
        console.log('onEdit', record);
    };
    const onRemove = (record: CategoryModel) => {
        console.log('onRemove', record);
    };

    return (
        <KPTable
            rowKey={'id'}
            scroll={{ x: 600 }}
            columns={columns}
            dataSource={stateCategories.data}
            loading={stateCategories.isLoading || stateDelete.isLoading}
            pagination={{
                current: stateCategories.page?.page,
                total: stateCategories.page?.pageCount,
                pageSize: stateCategories.page?.size,
                onChange: onChangePagination,
            }}
            hasPreviousPage={stateCategories.page?.hasPreviousPage}
            hasNextPage={stateCategories.page?.hasNextPage}
            filterForm={
                <Wrapper className="flex justify-between">
                    <KPInput
                        className="Category_input"
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
    .Category_input {
        max-width: 250px;
    }
`;

export default Category;
