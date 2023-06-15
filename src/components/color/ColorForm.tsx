import { FC, useMemo, useState } from 'react';

import { ColorPicker, Form, Radio } from 'antd';
import { Color } from 'antd/es/color-picker';
import styled, { CSSProperties } from 'styled-components';

import KPButton from '@components/KPButton';

import { ColorModel } from '@interfaces/Color.model';

import { UserActions } from '@constants/Constants.constants';

interface ColorFormProps {
    data?: ColorModel;
    action: UserActions;
    onSubmit: (data?: ColorModel) => void;
    onCancel: () => void;
}

const ColorForm: FC<ColorFormProps> = (props) => {
    const [form] = Form.useForm<ColorModel>();

    const [colorHex, setColorHex] = useState<Color | string>(
        props.data?.value ?? '#0d67dd',
    );

    const onFinish = (values: ColorModel) => {
        props.onSubmit({
            ...values,
            id: props.data?.id,
            status: values.status === 'ACTIVO' ? 1 : 0,
            value: bgColor,
        });
    };
    const bgColor = useMemo<string>(
        () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
        [colorHex],
    );

    const divStyle: CSSProperties = {
        backgroundColor: bgColor,
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
                        <label htmlFor="value">
                            Color<span>*</span>
                        </label>
                        <ColorPicker format="hex" value={colorHex} onChange={setColorHex}>
                            <div className="color-picker" style={divStyle} />
                        </ColorPicker>
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

const Wrapper = styled.div`
    .color-picker {
        width: 100%;
        height: 40px;
        border: 2px solid #d9d9d9;
        border-radius: 6px;
        margin-bottom: 24px;
    }
`;

export default ColorForm;
