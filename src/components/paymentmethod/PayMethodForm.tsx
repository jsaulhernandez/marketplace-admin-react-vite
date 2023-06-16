import { FC } from 'react';

import { Form, Radio } from 'antd';
import styled from 'styled-components';

import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';

import { PaymentMethodModel } from '@interfaces/PaymentMethod.model';

import { UserActions } from '@constants/Constants.constants';

interface PaymentMethodFormProps {
    data?: PaymentMethodModel;
    action: UserActions;
    onSubmit: (data?: PaymentMethodModel) => void;
    onCancel: () => void;
}

const PaymentMethodForm: FC<PaymentMethodFormProps> = (props) => {
    const [form] = Form.useForm<PaymentMethodModel>();

    const onFinish = (values: PaymentMethodModel) => {
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

export default PaymentMethodForm;
