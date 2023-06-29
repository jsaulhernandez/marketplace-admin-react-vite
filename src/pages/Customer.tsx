import { ChangeEvent, useEffect, useState } from 'react';

import { ColumnType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import moment from 'moment';

import KPTable from '@components/KPTable';
import KPInput from '@components/KPInput';

import useAxios from '@hooks/useAxios.hook';

import { CustomerModel } from '@interfaces/Customer.model';
import { UserStatus } from '@interfaces/User.model';

const Customer = () => {
    const [stateCustomers, fetchCustomers] = useAxios<CustomerModel[]>();

    const [filter, setFilter] = useState<string>();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCustomers = (page = '1', search = '') => {
        fetchCustomers({
            method: 'GET',
            path: '/customer',
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
            render: (_, record: CustomerModel) => getCustomerFullName(record),
        },
        {
            title: 'Documento',
            dataIndex: 'document',
        },
        {
            title: 'Tipo de documento',
            render: (_, record: CustomerModel) => record.typeDocument.name,
        },
        {
            title: 'Fecha de nacimiento',
            render: (_, record: CustomerModel) =>
                moment(record.dateBirth).format('DD/MM/YYYY'),
        },
        {
            title: 'Teléfono',
            render: (_, record: CustomerModel) => record.phone ?? 'N/A',
        },
        {
            title: 'Terminos',
            render: (_, record: CustomerModel) =>
                record.terms === 1 ? 'ACEPTADOS' : 'NO ACEPTADOS',
        },
        {
            title: 'Usuario',
            render: (_, record: CustomerModel) => record.user.email,
        },
        {
            title: 'Correo verificado',
            render: (_, record: CustomerModel) =>
                record.user.verifiedEmail === 1 ? 'SI' : 'NO',
        },
        {
            title: 'Estado usuario',
            render: (_, record: CustomerModel) => getStatusUser(record.user.status),
        },
        {
            title: 'Fecha de creación del usuario',
            render: (_, record: CustomerModel) =>
                record.user.createdAt
                    ? moment(record.user.createdAt).format('DD/MM/YYYY')
                    : 'N/A',
        },
        {
            title: 'Fecha de modificación del usuario',
            render: (_, record: CustomerModel) =>
                record.user.updatedAt
                    ? moment(record.user.updatedAt).format('DD/MM/YYYY')
                    : 'N/A',
        },
    ];

    const getCustomerFullName = (info: CustomerModel) => {
        let fullName = '';

        fullName += info.firstName + ' ';
        fullName += info.secondName ? info.secondName + ' ' : '';
        fullName += info.firstLastName + ' ';
        fullName += info.secondLastName ?? '';

        return fullName;
    };

    const getStatusUser = (status: keyof typeof UserStatus) => {
        if (status === 'ACTIVE') return 'Activo';
        if (status === 'BLOCKED') return 'Bloqueado';
        if (status === 'INACTIVE') return 'Inactivo';

        return 'Bloqueado permanentemente';
    };

    const onChangePagination = (value: number) => {
        setPage(value);
        getCustomers(value.toString(), filter);
    };

    const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value);
        getCustomers('1', e.target.value);
    };

    return (
        <KPTable
            rowKey={'id'}
            scroll={{ x: 600 }}
            columns={columns}
            dataSource={stateCustomers.data}
            loading={stateCustomers.isLoading}
            pagination={{
                current: stateCustomers.page?.page,
                total: stateCustomers.page?.pageCount,
                pageSize: stateCustomers.page?.size,
                onChange: onChangePagination,
            }}
            hasPreviousPage={stateCustomers.page?.hasPreviousPage}
            hasNextPage={stateCustomers.page?.hasNextPage}
            filterForm={
                <Wrapper className="flex justify-between">
                    <KPInput
                        className="Customer_input"
                        addonBefore={<SearchOutlined />}
                        onChange={onSearch}
                        placeholder="Buscar....."
                        height={40}
                    />
                </Wrapper>
            }
        />
    );
};

const Wrapper = styled.div`
    .Customer_input {
        max-width: 250px;
    }
`;

export default Customer;
