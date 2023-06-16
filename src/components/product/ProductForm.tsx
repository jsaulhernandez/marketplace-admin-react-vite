import { FC } from 'react';

import { Form, Radio, Select } from 'antd';
import styled from 'styled-components';

import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';

import { ProductModel } from '@interfaces/Product.model';

import { UserActions } from '@constants/Constants.constants';

interface ProductFormProps {
    data?: ProductModel;
    action: UserActions;
    onSubmit: (data?: ProductModel) => void;
    onCancel: () => void;
}

const ProductForm: FC<ProductFormProps> = (props) => {
    const [form] = Form.useForm<ProductModel>();

    const onFinish = (values: ProductModel) => {
        props.onSubmit({
            ...values,
            id: props.data?.id,
            status: values.status === 'ACTIVO' ? 1 : 0,
        });
    };

    return (
        <Wrapper className="kp-card">
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={
                    props.action === 'save'
                        ? { status: 'ACTIVO' }
                        : {
                              ...props.data,
                              status: props.data?.status === 1 ? 'ACTIVO' : 'INACTIVO',
                          }
                }
            >
                <div className="kp-row">
                    <div className="kp-column">
                        <label htmlFor="title">
                            Titulo<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="title"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <KPInput />
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="name">
                            Nombre<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="name"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <KPInput />
                        </Form.Item>
                    </div>
                </div>

                <div className="kp-row">
                    <div className="kp-column">
                        <label htmlFor="stock">
                            Stock<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="stock"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <KPInput />
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="price">
                            Precio<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="price"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <KPInput />
                        </Form.Item>
                    </div>
                </div>

                <div className="kp-row">
                    <div className="kp-column">
                        <label htmlFor="category">
                            Categoría<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name={['category', 'id']}
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select>
                                <Select.Option key={'2'}>Categories</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="status">
                            Estado<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="status"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Radio.Group buttonStyle="solid">
                                <Radio.Button value="ACTIVO">ACTIVO</Radio.Button>
                                <Radio.Button value="INACTIVO">INACTIVO</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                </div>

                <div className="kp-row">
                    <div className="kp-column">
                        <label htmlFor="memorySize">
                            Tamaños de memoria<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name={['memorySize', 'id']}
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select>
                                <Select.Option key={'2'}>Mmeory sizes</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="processor">
                            Procesador<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name={['processor', 'id']}
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select>
                                <Select.Option key={'2'}>processors</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className="kp-row">
                    <div className="kp-column">
                        <label htmlFor="color">
                            Colores<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name={['color', 'id']}
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select>
                                <Select.Option key={'2'}>Colors</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="payMethod">
                            Metodos de pago<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name={['payMethod', 'id']}
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select>
                                <Select.Option key={'2'}>payMethod</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className="kp-column" style={{ width: '100%' }}>
                    <label htmlFor="detail">
                        Detalles<span>*</span>
                    </label>
                    <Form.Item
                        hasFeedback
                        name="detail"
                        rules={[{ required: true, message: 'Este campo es requerido' }]}
                    >
                        <KPInput typeInput="textarea" />
                    </Form.Item>
                </div>

                <div className="kp-column" style={{ width: '100%' }}>
                    <label htmlFor="specification">
                        Especificaciones<span>*</span>
                    </label>
                    <Form.Item
                        hasFeedback
                        name="specification"
                        rules={[{ required: true, message: 'Este campo es requerido' }]}
                    >
                        <KPInput typeInput="textarea" />
                    </Form.Item>
                </div>

                <div className="flex justify-center items-center g-20">
                    <KPButton type="secondary" onClick={props.onCancel}>
                        Cancelar
                    </KPButton>
                    <KPButton type="primary" htmlType="submit">
                        {props.action === 'save' ? 'Guardar' : 'Actualizar'}
                    </KPButton>
                </div>
            </Form>
        </Wrapper>
    );
};

const Wrapper = styled.div``;

export default ProductForm;
