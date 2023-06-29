import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import {
    EyeOutlined,
    FileExcelOutlined,
    PlusOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';
import ProductForm from '@components/product/ProductForm';
import ModalInformationProduct from '@components/product/ModalInformationProduct';
import KPModalActions from '@components/KPModalActions';

import useAxios from '@hooks/useAxios.hook';

import { ProductModel } from '@interfaces/Product.model';

import { formatMoney } from '@utils/Numbers.utils';
import { CustomHeader, getDataFormatByHeaders } from '@utils/Object.utils';
import { exportToExcel } from '@utils/File.utils';

import { ModalActionsType, SHOWING, UserActions } from '@constants/Constants.constants';

const Product = () => {
    const [stateProducts, fetchProducts] = useAxios<ProductModel[]>();
    const [stateSave, fetchSave] = useAxios<ProductModel>();
    const [stateDelete, fetchDelete] = useAxios<boolean>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(false);

    //Form
    const [component, setComponent] = useState<SHOWING>('Table');
    const [data, setData] = useState<ProductModel>();
    const [action, setAction] = useState<UserActions>('save');

    //Modal
    const [open, setOpen] = useState<boolean>(false);
    const [typeModal, setTypeModal] = useState<ModalActionsType>('confirm');
    const [textModal, setTextModal] = useState<string>();

    useEffect(() => {
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getProducts = (page = '1', search = '', category = '0') => {
        fetchProducts({
            method: 'GET',
            path: '/product',
            queries: {
                page,
                size: '10',
                search,
                category,
            },
        });
    };

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const columns: ColumnType<any>[] = [
        {
            title: 'Titulo',
            dataIndex: 'title',
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
        },
        {
            title: 'Imagen',
            render: (_, record: ProductModel) => '',
        },
        {
            title: 'Disponible',
            render: (_, record: ProductModel) => `${record.stock} unidades`,
        },
        {
            title: 'Precio',
            render: (_, record: ProductModel) => `${formatMoney(record.price)}`,
        },
        {
            title: 'Categoría',
            render: (_, record: ProductModel) => record.category.name ?? '',
        },
        {
            title: 'Estado',
            render: (_, record: ProductModel) => (
                <Switch
                    checked={record.status === 1}
                    onChange={(value) => onChangeStatus(record, value)}
                />
            ),
        },
        {
            title: 'Ver más información',
            render: (_, record: ProductModel) => (
                <KPButton
                    type="primary"
                    prefix={<EyeOutlined />}
                    onClick={() => onShowProductInformation(record)}
                />
            ),
        },
        {
            title: 'Acciones',
            render: (_, record: ProductModel) => (
                <KPActions
                    onEdit={() => onAddProduct(record, false, 'update')}
                    onRemove={() => onRemove(record)}
                />
            ),
        },
    ];

    const dataHeader: CustomHeader<ProductModel>[] = [
        {
            title: 'Titulo',
            dataKey: 'title',
        },
        {
            title: 'Nombre',
            dataKey: 'name',
        },
        {
            title: 'Disponible',
            render: (record) => `${record.stock} unidades`,
        },
        {
            title: 'Precio',
            render: (record) => `${formatMoney(record.price)}`,
        },
        {
            title: 'Categoría',
            render: (record) => record.category.name ?? '',
        },
        {
            title: 'Estado',
            render: (record) => (record.status === 1 ? 'Activo' : 'Inactivo'),
        },
    ];

    const onChangePagination = (value: number) => {
        setPage(value);
        getProducts(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getProducts('1', e.target.value);
    };

    const onChangeStatus = async (record: ProductModel, value: boolean) => {
        record.status = value ? 1 : 0;

        const response = await fetchSave({
            method: 'PATCH',
            data: record,
            path: `/product/${record.id}`,
        });

        if (response.isSuccess) getProducts(page.toString(), filter);
    };

    const onAddProduct = (
        record?: ProductModel,
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
                } el producto ${record?.title}?`,
            );
            setTypeModal('confirm');
            setOpen(true);
        }
    };

    const onRemove = (record: ProductModel) => {
        setData(record);
        setAction('delete');
        setTextModal('¿Estás seguro de eliminar el registro?');
        setTypeModal('confirm');
        setOpen(!open);
    };

    const onShowProductInformation = (record: ProductModel) => {
        setData(record);
        setShowModal(!showModal);
    };

    const onConfirm = async () => {
        if (action === 'save' || action === 'update') {
            const path = `/product${action === 'update' ? '/' + data?.id : ''}`;

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
                getProducts();
                setComponent('Table');
            } else {
                setTextModal(
                    `Ocurrio un error al ${
                        action === 'save' ? 'guardar' : 'actualizar'
                    } el producto ${data?.title}`,
                );
                setTypeModal('error');
            }
        } else {
            const response = await fetchDelete({
                method: 'DELETE',
                path: `/product/${data?.id}`,
            });

            if (response.isSuccess) {
                setTextModal('Registro eliminado correctamente');
                setTypeModal('success');

                setData(undefined);
                getProducts();
            } else {
                setTextModal(`Ocurrio un error al eliminar el producto ${data?.title}`);
                setTypeModal('error');
            }
        }
    };

    const generateExcel = () => {
        const customData = getDataFormatByHeaders(dataHeader, stateProducts.data ?? []);
        exportToExcel(customData, 'Reporte de productos');
    };

    return (
        <>
            {component === 'Table' ? (
                <>
                    <KPTable
                        rowKey={'id'}
                        scroll={{ x: 600 }}
                        columns={columns}
                        dataSource={stateProducts.data}
                        loading={stateProducts.isLoading || stateDelete.isLoading}
                        pagination={{
                            current: stateProducts.page?.page,
                            total: stateProducts.page?.pageCount,
                            pageSize: stateProducts.page?.size,
                            onChange: onChangePagination,
                        }}
                        hasPreviousPage={stateProducts.page?.hasPreviousPage}
                        hasNextPage={stateProducts.page?.hasNextPage}
                        filterForm={
                            <Wrapper className="flex flex-column g-10">
                                <div className="flex justify-end">
                                    <KPButton
                                        type="primary"
                                        suffix={<PlusOutlined />}
                                        onClick={onAddProduct}
                                    >
                                        Agregar
                                    </KPButton>
                                </div>
                                <div className="flex justify-between">
                                    <KPInput
                                        className="Product_input"
                                        addonBefore={<SearchOutlined />}
                                        onChange={onSearch}
                                        placeholder="Buscar....."
                                        height={40}
                                    />
                                    <KPButton
                                        type="link"
                                        suffix={<FileExcelOutlined />}
                                        onClick={generateExcel}
                                    >
                                        Exportar
                                    </KPButton>
                                </div>
                            </Wrapper>
                        }
                    />
                    <ModalInformationProduct
                        data={data}
                        open={showModal}
                        onClose={setShowModal}
                    />
                </>
            ) : (
                <ProductForm
                    action={action}
                    data={data}
                    onCancel={() => {
                        setData(undefined);
                        setComponent('Table');
                    }}
                    onSubmit={(value) => onAddProduct(value, true)}
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
    .Product_input {
        max-width: 250px;
    }
`;

export default Product;
