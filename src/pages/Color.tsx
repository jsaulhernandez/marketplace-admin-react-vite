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
import ColorForm from '@components/color/ColorForm';
import KPModalActions from '@components/KPModalActions';

import useAxios from '@hooks/useAxios.hook';

import { ColorModel } from '@interfaces/Color.model';

import { ModalActionsType, SHOWING, UserActions } from '@constants/Constants.constants';

const Color = () => {
    const [stateColors, fetchColors] = useAxios<ColorModel[]>();
    const [stateSave, fetchSave] = useAxios<ColorModel>();
    const [stateDelete, fetchDelete] = useAxios<boolean>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    //Form
    const [component, setComponent] = useState<SHOWING>('Table');
    const [data, setData] = useState<ColorModel>();
    const [action, setAction] = useState<UserActions>('save');

    //Modal
    const [open, setOpen] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<ModalActionsType>('confirm');
    const [textModal, setTextModal] = useState<string>();

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
                    onEdit={() => onAddColor(record, false, 'update')}
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

        const response = await fetchSave({
            method: 'PATCH',
            data: record,
            path: `/color/${record.id}`,
        });

        if (response.isSuccess) getColors(page.toString(), filter);
    };

    const onAddColor = (
        record?: ColorModel,
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
                } el color ${record?.value}?`,
            );
            setTypeModal('confirm');
            setOpen(true);
        }
    };

    const onRemove = (record: ColorModel) => {
        setData(record);
        setAction('delete');
        setTextModal('¿Estás seguro de eliminar el registro?');
        setTypeModal('confirm');
        setOpen(!open);
    };

    const onConfirm = async () => {
        if (action === 'save' || action === 'update') {
            const path = `/color${action === 'update' ? '/' + data?.id : ''}`;

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
                getColors();
                setComponent('Table');
            } else {
                setTextModal(
                    `Ocurrio un error al ${
                        action === 'save' ? 'guardar' : 'actualizar'
                    } el color ${data?.value}`,
                );
                setTypeModal('error');
            }
        } else {
            const response = await fetchDelete({
                method: 'DELETE',
                path: `/color/${data?.id}`,
            });

            if (response.isSuccess) {
                setTextModal('Registro eliminado correctamente');
                setTypeModal('success');

                setData(undefined);
                getColors();
            } else {
                setTextModal(`Ocurrio un error al eliminar el color ${data?.value}`);
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
                            <KPButton
                                type="primary"
                                suffix={<PlusOutlined />}
                                onClick={onAddColor}
                            >
                                Agregar
                            </KPButton>
                        </Wrapper>
                    }
                />
            ) : (
                <ColorForm
                    action={action}
                    data={data}
                    onCancel={() => {
                        setData(undefined);
                        setComponent('Table');
                    }}
                    onSubmit={(value) => onAddColor(value, true)}
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
    .Color_input {
        max-width: 250px;
    }
`;

export default Color;
