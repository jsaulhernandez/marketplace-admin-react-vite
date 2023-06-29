import { FC } from 'react';

import { Form, Radio } from 'antd';
import styled from 'styled-components';

import KPButton from '@components/KPButton';
import KPInput from '@components/KPInput';

import { TypeDocumentModel } from '@interfaces/TypeDocument.model';

import { UserActions } from '@constants/Constants.constants';

interface TypeDocumentFormProps {
    data?: TypeDocumentModel;
    action: UserActions;
    onSubmit: (data?: TypeDocumentModel) => void;
    onCancel: () => void;
}

const TypeDocumentForm: FC<TypeDocumentFormProps> = (props) => {
    const [form] = Form.useForm<TypeDocumentModel>();

    const onFinish = (values: TypeDocumentModel) => {
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

                    <div className="kp-column">
                        <label htmlFor="masking">
                            Mascara<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="masking"
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

export default TypeDocumentForm;
