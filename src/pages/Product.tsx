import { ChangeEvent, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPActions from '@components/KPActions';
import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';
import ProductForm from '@components/product/ProductForm';
import ModalInformationProduct from '@components/product/ModalInformationProduct';

import useAxios from '@hooks/useAxios.hook';

import { ProductModel } from '@interfaces/Product.model';

import { formatMoney } from '@utils/Numbers.utils';

import { SHOWING } from '@constants/Constants.constants';

const Product = () => {
    const [stateProducts, fetchProducts] = useAxios<ProductModel[]>();
    const [stateDelete, fetchDelete] = useAxios<ProductModel>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(false);

    //Form
    const [component, setComponent] = useState<SHOWING>('Table');
    const [data, setData] = useState<ProductModel>();

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
                    onEdit={() => onEdit(record)}
                    onRemove={() => onRemove(record)}
                />
            ),
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

        const response = await fetchDelete({
            method: 'PATCH',
            data: record,
            path: `/product/${record.id}`,
        });

        if (response.isSuccess) getProducts(page.toString(), filter);
    };

    const onEdit = (record: ProductModel) => {
        console.log('onEdit', record);
    };
    const onRemove = (record: ProductModel) => {
        console.log('onRemove', record);
    };

    const onAddProduct = () => {
        setData(undefined);
        setComponent('Form');
    };

    const onShowProductInformation = (record: ProductModel) => {
        setData(record);
        setShowModal(!showModal);
    };

    return component === 'Table' ? (
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
                    <Wrapper className="flex justify-between">
                        <KPInput
                            className="Product_input"
                            addonBefore={<SearchOutlined />}
                            onChange={onSearch}
                            placeholder="Buscar....."
                        />
                        <KPButton
                            type="primary"
                            suffix={<PlusOutlined />}
                            onClick={onAddProduct}
                        >
                            Agregar
                        </KPButton>
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
        <ProductForm />
    );
};

const Wrapper = styled.div`
    .Product_input {
        max-width: 250px;
    }
`;

export default Product;
