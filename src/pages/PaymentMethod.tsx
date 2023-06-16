import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';
import PaymentMethodForm from '@components/paymentmethod/PayMethodForm';
import KPModalActions from '@components/KPModalActions';

import useAxios from '@hooks/useAxios.hook';

import { PaymentMethodModel } from '@interfaces/PaymentMethod.model';

import { ModalActionsType, SHOWING, UserActions } from '@constants/Constants.constants';

const PaymentMethod = () => {
    const [statePayMethod, fetchPayMethod] = useAxios<PaymentMethodModel[]>();
    const [stateSave, fetchSave] = useAxios<PaymentMethodModel>();
    const [stateDelete, fetchDelete] = useAxios<boolean>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    //Form
    const [component, setComponent] = useState<SHOWING>('Table');
    const [data, setData] = useState<PaymentMethodModel>();
    const [action, setAction] = useState<UserActions>('save');

    //Modal
    const [open, setOpen] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<ModalActionsType>('confirm');
    const [textModal, setTextModal] = useState<string>();

    useEffect(() => {
        getPaymentMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPaymentMethods = (page = '1', filter = '') => {
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
            render: (_, record: PaymentMethodModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: PaymentMethodModel) => (
                <KPActions
                    onEdit={() => onAddPaymentMethod(record, false, 'update')}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getPaymentMethods(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getPaymentMethods('1', e.target.value);
    };

    const onChangeStatus = async (record: PaymentMethodModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchSave({
            method: 'PATCH',
            data: record,
            path: `/pay-method/${record.id}`,
        });

        if (response.isSuccess) getPaymentMethods(page.toString(), filter);
    };

    const onAddPaymentMethod = (
        record?: PaymentMethodModel,
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
                } el método ${record?.name}?`,
            );
            setTypeModal('confirm');
            setOpen(true);
        }
    };

    const onRemove = (record: PaymentMethodModel) => {
        setData(record);
        setAction('delete');
        setTextModal('¿Estás seguro de eliminar el registro?');
        setTypeModal('confirm');
        setOpen(!open);
    };

    const onConfirm = async () => {
        if (action === 'save' || action === 'update') {
            const path = `/pay-method${action === 'update' ? '/' + data?.id : ''}`;

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
                getPaymentMethods();
                setComponent('Table');
            } else {
                setTextModal(
                    `Ocurrio un error al ${
                        action === 'save' ? 'guardar' : 'actualizar'
                    } el método ${data?.name}`,
                );
                setTypeModal('error');
            }
        } else {
            const response = await fetchDelete({
                method: 'DELETE',
                path: `/pay-method/${data?.id}`,
            });

            if (response.isSuccess) {
                setTextModal('Registro eliminado correctamente');
                setTypeModal('success');

                setData(undefined);
                getPaymentMethods();
            } else {
                setTextModal(
                    `Ocurrio un error al eliminar el método de pago ${data?.name}`,
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
                            <KPButton
                                type="primary"
                                suffix={<PlusOutlined />}
                                onClick={onAddPaymentMethod}
                            >
                                Agregar
                            </KPButton>
                        </Wrapper>
                    }
                />
            ) : (
                <PaymentMethodForm
                    action={action}
                    data={data}
                    onCancel={() => {
                        setData(undefined);
                        setComponent('Table');
                    }}
                    onSubmit={(value) => onAddPaymentMethod(value, true)}
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
    .PayMethod_input {
        max-width: 250px;
    }
`;

export default PaymentMethod;
