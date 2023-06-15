import { FC, useState } from 'react';

import { Form, Radio, Select } from 'antd';
import styled from 'styled-components';

import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';

import { MemorySizeModel } from '@interfaces/MemorySize.model';

import { validateNumbers } from '@utils/Validator.utils';

import { UnitsMeasurementStorageSize, UserActions } from '@constants/Constants.constants';

interface MemorySizeFormProps {
    data?: MemorySizeModel;
    action: UserActions;
    onSubmit: (data?: MemorySizeModel) => void;
    onCancel: () => void;
}

const MemorySizeForm: FC<MemorySizeFormProps> = (props) => {
    const [form] = Form.useForm<MemorySizeModel>();

    const [units, setUnit] = useState<string>('GB');

    const onFinish = (values: MemorySizeModel) => {
        props.onSubmit({
            ...values,
            id: props.data?.id,
            value: values.value.trim() + ' ' + units,
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
                        ? { status: 'ACTIVO', units: units }
                        : {
                              ...props.data,
                              status: props.data?.status === 1 ? 'ACTIVO' : 'INACTIVO',
                              value: props.data?.value.split(' ')[0],
                              units: props.data?.value.split(' ')[1],
                          }
                }
            >
                <div className="kp-row">
                    <div className="kp-column">
                        <label htmlFor="name">
                            Tamaño de memoria<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="value"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                                {
                                    validator: (_, value) => validateNumbers(value),
                                },
                            ]}
                        >
                            <KPInput />
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="units">
                            Unidad de medida<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="units"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select onChange={setUnit}>
                                {UnitsMeasurementStorageSize.map((um) => (
                                    <Select.Option key={um.key}>{um.value}</Select.Option>
                                ))}
                            </Select>
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

export default MemorySizeForm;
