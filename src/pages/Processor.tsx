import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';
import ProcessorForm from '@components/processor/ProcessorForm';
import KPModalActions from '@components/KPModalActions';

import useAxios from '@hooks/useAxios.hook';

import { ProcessorModel } from '@interfaces/Processor.model';

import { ModalActionsType, SHOWING, UserActions } from '@constants/Constants.constants';

const Processor = () => {
    const [stateProcessor, fetchProcessor] = useAxios<ProcessorModel[]>();
    const [stateSave, fetchSave] = useAxios<ProcessorModel>();
    const [stateDelete, fetchDelete] = useAxios<boolean>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    //Form
    const [component, setComponent] = useState<SHOWING>('Table');
    const [data, setData] = useState<ProcessorModel>();
    const [action, setAction] = useState<UserActions>('save');

    //Modal
    const [open, setOpen] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<ModalActionsType>('confirm');
    const [textModal, setTextModal] = useState<string>();

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
                    onEdit={() => onAddProcessor(record, false, 'update')}
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

        const response = await fetchSave({
            method: 'PATCH',
            data: record,
            path: `/processor/${record.id}`,
        });

        if (response.isSuccess) getProcessors(page.toString(), filter);
    };

    const onAddProcessor = (
        record?: ProcessorModel,
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
                } el procesador ${record?.name}?`,
            );
            setTypeModal('confirm');
            setOpen(true);
        }
    };

    const onRemove = (record: ProcessorModel) => {
        setData(record);
        setAction('delete');
        setTextModal('¿Estás seguro de eliminar el registro?');
        setTypeModal('confirm');
        setOpen(!open);
    };

    const onConfirm = async () => {
        if (action === 'save' || action === 'update') {
            const path = `/processor${action === 'update' ? '/' + data?.id : ''}`;

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
                getProcessors();
                setComponent('Table');
            } else {
                setTextModal(
                    `Ocurrio un error al ${
                        action === 'save' ? 'guardar' : 'actualizar'
                    } el procesador ${data?.name}`,
                );
                setTypeModal('error');
            }
        } else {
            const response = await fetchDelete({
                method: 'DELETE',
                path: `/processor/${data?.id}`,
            });

            if (response.isSuccess) {
                setTextModal('Registro eliminado correctamente');
                setTypeModal('success');

                setData(undefined);
                getProcessors();
            } else {
                setTextModal(`Ocurrio un error al eliminar el procesador ${data?.name}`);
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
                                height={40}
                            />
                            <KPButton
                                type="primary"
                                suffix={<PlusOutlined />}
                                onClick={onAddProcessor}
                            >
                                Agregar
                            </KPButton>
                        </Wrapper>
                    }
                />
            ) : (
                <ProcessorForm
                    action={action}
                    data={data}
                    onCancel={() => {
                        setData(undefined);
                        setComponent('Table');
                    }}
                    onSubmit={(value) => onAddProcessor(value, true)}
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
    .Processor_input {
        max-width: 250px;
    }
`;

export default Processor;
