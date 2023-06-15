import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';
import MemorySizeForm from '@components/memorysize/MemorySizeForm';
import KPModalActions from '@components/KPModalActions';

import useAxios from '@hooks/useAxios.hook';

import { MemorySizeModel } from '@interfaces/MemorySize.model';

import { ModalActionsType, SHOWING, UserActions } from '@constants/Constants.constants';

const MemorySize = () => {
    const [stateMemorySize, fetchMemorySize] = useAxios<MemorySizeModel[]>();
    const [stateSave, fetchSave] = useAxios<MemorySizeModel>();
    const [stateDelete, fetchDelete] = useAxios<boolean>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    //Form
    const [component, setComponent] = useState<SHOWING>('Table');
    const [data, setData] = useState<MemorySizeModel>();
    const [action, setAction] = useState<UserActions>('save');

    //Modal
    const [open, setOpen] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<ModalActionsType>('confirm');
    const [textModal, setTextModal] = useState<string>();

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
                    onEdit={() => onAddMemorySize(record, false, 'update')}
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

        const response = await fetchSave({
            method: 'PATCH',
            data: record,
            path: `/memory-size/${record.id}`,
        });

        if (response.isSuccess) getMemoriesSizes(page.toString(), filter);
    };

    const onAddMemorySize = (
        record?: MemorySizeModel,
        isSave = false,
        userAction: UserActions = 'save',
    ) => {
        if (!isSave) {
            setData(record);
            setComponent('Form');
            setAction(userAction);
        } else {
            if (record) setData({ ...record });
            setTextModal(
                `¿En realidad desea ${
                    action === 'save' ? 'guardar' : 'actualizar'
                } el tamaño de memoria ${record?.value}?`,
            );
            setTypeModal('confirm');
            setOpen(true);
        }
    };

    const onRemove = (record: MemorySizeModel) => {
        setData(record);
        setAction('delete');
        setTextModal('¿Estás seguro de eliminar el registro?');
        setTypeModal('confirm');
        setOpen(!open);
    };

    const onConfirm = async () => {
        if (action === 'save' || action === 'update') {
            const path = `/memory-size${action === 'update' ? '/' + data?.id : ''}`;

            const response = await fetchSave({
                method: action === 'save' ? 'POST' : 'PATCH',
                path,
                data: data,
            });

            if (response.isSuccess) {
                setTextModal(
                    `Registro ${
                        action === 'save' ? 'guardado' : 'actualizado'
                    } correctamente`,
                );
                setTypeModal('success');

                setData(undefined);
                getMemoriesSizes();
                setComponent('Table');
            } else {
                setTextModal(
                    `Ocurrio un error al ${
                        action === 'save' ? 'guardar' : 'actualizar'
                    } el tamaño de memoria ${data?.value}`,
                );
                setTypeModal('error');
            }
        } else {
            const response = await fetchDelete({
                method: 'DELETE',
                path: `/memory-size/${data?.id}`,
            });

            if (response.isSuccess) {
                setTextModal('Registro eliminado correctamente');
                setTypeModal('success');

                setData(undefined);
                getMemoriesSizes();
            } else {
                setTextModal(
                    `Ocurrio un error al eliminar el tamaño de memoria ${data?.value}`,
                );
                setTypeModal('error');
            }
        }
    };

    return (
        <>
            {component === 'Table' ? (
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
                                height={40}
                            />
                            <KPButton
                                type="primary"
                                suffix={<PlusOutlined />}
                                onClick={onAddMemorySize}
                            >
                                Agregar
                            </KPButton>
                        </Wrapper>
                    }
                />
            ) : (
                <MemorySizeForm
                    action={action}
                    data={data}
                    onCancel={() => {
                        setData(undefined);
                        setComponent('Table');
                    }}
                    onSubmit={(value) => onAddMemorySize(value, true)}
                />
            )}

            <KPModalActions
                open={open}
                type={typeModal}
                title={textModal}
                onClose={setOpen}
                onConfirm={onConfirm}
                typeButton={action === 'delete' ? 'danger' : undefined}
                textConfirm={action === 'delete' ? 'Sí, eliminar' : undefined}
                loading={stateDelete.isLoading || stateSave.isLoading}
            />
        </>
    );
};
const Wrapper = styled.div`
    .MemorySize_input {
        max-width: 250px;
    }
`;

export default MemorySize;
