import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import {
    CodepenCircleOutlined,
    DribbbleSquareOutlined,
    GithubOutlined,
    PlusOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';

import useAxios from '@hooks/useAxios.hook';

import { ColorModel } from '@interfaces/Color.model';

const Color = () => {
    const [stateColors, fetchColors] = useAxios<ColorModel[]>();
    const [stateDelete, fetchDelete] = useAxios<ColorModel>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getColors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getColors = (page = '1', search = '') => {
        fetchColors({
            method: 'GET',
            path: '/color',
            queries: {
                page,
                search,
                size: '10',
            },
        });
    };

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const columns: ColumnType<any>[] = [
        {
            title: 'Valor',
            render: (_, record: ColorModel) => (
                <div
                    style={{
                        background: `${record.value}`,
                        width: 100,
                        textAlign: 'center',
                        borderRadius: 20,
                        color: 'white',
                    }}
                >
                    {record.value}
                </div>
            ),
        },
        {
            title: 'Representación',
            render: (_, record: ColorModel) => (
                <div className="flex" style={{ gap: 30 }}>
                    <GithubOutlined
                        style={{ transform: 'scale(2.5)', color: `${record.value}` }}
                    />
                    <CodepenCircleOutlined
                        style={{ transform: 'scale(2.5)', color: `${record.value}` }}
                    />
                    <DribbbleSquareOutlined
                        style={{ transform: 'scale(2.5)', color: `${record.value}` }}
                    />
                </div>
            ),
        },
        {
            title: 'Estado',
            render: (_, record: ColorModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: ColorModel) => (
                <KPActions
                    onEdit={() => onEdit(record)}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getColors(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getColors('1', e.target.value);
    };

    const onChangeStatus = async (record: ColorModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchDelete({
            method: 'PATCH',
            data: record,
            path: `/color/${record.id}`,
        });

        if (response.isSuccess) getColors(page.toString(), filter);
    };

    const onEdit = (record: ColorModel) => {
        console.log('onEdit', record);
    };
    const onRemove = (record: ColorModel) => {
        console.log('onRemove', record);
    };

    return (
        <KPTable
            rowKey={'id'}
            scroll={{ x: 600 }}
            columns={columns}
            dataSource={stateColors.data}
            loading={stateColors.isLoading || stateDelete.isLoading}
            pagination={{
                current: stateColors.page?.page,
                total: stateColors.page?.pageCount,
                pageSize: stateColors.page?.size,
                onChange: onChangePagination,
            }}
            hasPreviousPage={stateColors.page?.hasPreviousPage}
            hasNextPage={stateColors.page?.hasNextPage}
            filterForm={
                <Wrapper className="flex justify-between">
                    <KPInput
                        className="Color_input"
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
    .Color_input {
        max-width: 250px;
    }
`;

export default Color;
