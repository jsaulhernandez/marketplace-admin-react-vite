import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';
import KPModalActions from '@components/KPModalActions';
import TypeDocumentForm from '@components/typedocument/TypeDocumentForm';

import useAxios from '@hooks/useAxios.hook';

import { TypeDocumentModel } from '@interfaces/TypeDocument.model';

import { ModalActionsType, SHOWING, UserActions } from '@constants/Constants.constants';

const TypeDocument = () => {
    const [stateTypesDocuments, fetchTypesDocuments] = useAxios<TypeDocumentModel[]>();
    const [stateSave, fetchSave] = useAxios<TypeDocumentModel>();
    const [stateDelete, fetchDelete] = useAxios<boolean>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    //Form
    const [component, setComponent] = useState<SHOWING>('Table');
    const [data, setData] = useState<TypeDocumentModel>();
    const [action, setAction] = useState<UserActions>('save');

    //Modal
    const [open, setOpen] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<ModalActionsType>('confirm');
    const [textModal, setTextModal] = useState<string>();

    useEffect(() => {
        getTypesDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTypesDocuments = (page = '1', search = '') => {
        fetchTypesDocuments({
            method: 'GET',
            path: '/type-document',
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
            title: 'Nombre',
            dataIndex: 'name',
        },
        {
            title: 'Mascara',
            dataIndex: 'masking',
        },
        {
            title: 'Estado',
            render: (_, record: TypeDocumentModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: TypeDocumentModel) => (
                <KPActions
                    onEdit={() => onAddTypeDocument(record, false, 'update')}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getTypesDocuments(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getTypesDocuments('1', e.target.value);
    };

    const onChangeStatus = async (record: TypeDocumentModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchSave({
            method: 'PATCH',
            data: record,
            path: `/type-document/${record.id}`,
        });

        if (response.isSuccess) getTypesDocuments(page.toString(), filter);
    };

    const onAddTypeDocument = (
        record?: TypeDocumentModel,
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
                } el tipo de documento ${record?.name}?`,
            );
            setTypeModal('confirm');
            setOpen(true);
        }
    };

    const onRemove = (record: TypeDocumentModel) => {
        setData(record);
        setAction('delete');
        setTextModal('¿Estás seguro de eliminar el registro?');
        setTypeModal('confirm');
        setOpen(!open);
    };

    const onConfirm = async () => {
        if (action === 'save' || action === 'update') {
            const path = `/type-document${action === 'update' ? '/' + data?.id : ''}`;

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
                getTypesDocuments();
                setComponent('Table');
            } else {
                setTextModal(
                    `Ocurrio un error al ${
                        action === 'save' ? 'guardar' : 'actualizar'
                    } el tipo de documento ${data?.name}`,
                );
                setTypeModal('error');
            }
        } else {
            const response = await fetchDelete({
                method: 'DELETE',
                path: `/type-document/${data?.id}`,
            });

            if (response.isSuccess) {
                setTextModal('Registro eliminado correctamente');
                setTypeModal('success');

                setData(undefined);
                getTypesDocuments();
            } else {
                setTextModal(
                    `Ocurrio un error al eliminar el tipo de documento ${data?.name}`,
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
                    dataSource={stateTypesDocuments.data}
                    loading={stateTypesDocuments.isLoading || stateDelete.isLoading}
                    pagination={{
                        current: stateTypesDocuments.page?.page,
                        total: stateTypesDocuments.page?.pageCount,
                        pageSize: stateTypesDocuments.page?.size,
                        onChange: onChangePagination,
                    }}
                    hasPreviousPage={stateTypesDocuments.page?.hasPreviousPage}
                    hasNextPage={stateTypesDocuments.page?.hasNextPage}
                    filterForm={
                        <Wrapper className="flex justify-between">
                            <KPInput
                                className="TypeDocument_input"
                                addonBefore={<SearchOutlined />}
                                onChange={onSearch}
                                placeholder="Buscar....."
                                height={40}
                            />
                            <KPButton
                                type="primary"
                                suffix={<PlusOutlined />}
                                onClick={onAddTypeDocument}
                            >
                                Agregar
                            </KPButton>
                        </Wrapper>
                    }
                />
            ) : (
                <TypeDocumentForm
                    action={action}
                    data={data}
                    onCancel={() => {
                        setData(undefined);
                        setComponent('Table');
                    }}
                    onSubmit={(value) => onAddTypeDocument(value, true)}
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
    .TypeDocument_input {
        max-width: 250px;
    }
`;
export default TypeDocument;
