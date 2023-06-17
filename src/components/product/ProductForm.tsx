import { FC, useEffect, useState } from 'react';

import { Form, Radio, Select } from 'antd';
import styled from 'styled-components';

import KPInput from '@components/KPInput';
import KPButton from '@components/KPButton';
import KPEditor from '@components/KPEditor';

import useAxios from '@hooks/useAxios.hook';

import { CategoryModel } from '@interfaces/Category.model';
import { ColorModel } from '@interfaces/Color.model';
import { MemorySizeModel } from '@interfaces/MemorySize.model';
import { PaymentMethodModel } from '@interfaces/PaymentMethod.model';
import { ProductModel } from '@interfaces/Product.model';
import { ProcessorModel } from '@interfaces/Processor.model';

import { validateDecimalNumbers, validateNumbers } from '@utils/Validator.utils';

import { UserActions } from '@constants/Constants.constants';

interface ProductFormProps {
    data?: ProductModel;
    action: UserActions;
    onSubmit: (data?: ProductModel) => void;
    onCancel: () => void;
}

const ProductForm: FC<ProductFormProps> = (props) => {
    const [form] = Form.useForm<ProductModel>();

    const [stateCategories, fetchCategories] = useAxios<CategoryModel[]>();
    const [stateColors, fetchColors] = useAxios<ColorModel[]>();
    const [stateMemorySizes, fetchMemorySizes] = useAxios<MemorySizeModel[]>();
    const [statePaymentMethods, fetchPaymentMethods] = useAxios<PaymentMethodModel[]>();
    const [stateProcessors, fetchProcessors] = useAxios<CategoryModel[]>();

    const [colors, setColors] = useState<string[]>([]);
    const [memorySizes, setMemorySizes] = useState<string[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
    const [processors, setProcessors] = useState<string[]>([]);

    const [textEditor, setTextEditor] = useState<string>(props.data?.specification ?? '');
    const [requiredTextEditor, setRequiredTextEditor] = useState<boolean>(false);

    useEffect(() => {
        fetchCategories('/category/active');
        fetchColors('/color/active');
        fetchMemorySizes('/memory-size/active');
        fetchPaymentMethods('/payment-method/active');
        fetchProcessors('/processor/active');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        form.setFieldValue('memorySize', []);
        if (stateMemorySizes.isSuccess && stateMemorySizes.data) {
            const memorySizesData =
                props.data?.memorySize
                    .filter((m) => {
                        return stateMemorySizes.data?.find((mz) => mz.id === m.id);
                    })
                    .map((m) => {
                        return m.id + '';
                    }) ?? [];

            setMemorySizes(memorySizesData);
            form.setFieldValue('memorySize', memorySizesData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateMemorySizes.isSuccess]);

    useEffect(() => {
        form.setFieldValue('processor', []);
        if (stateProcessors.isSuccess && stateProcessors.data) {
            const processorsData =
                props.data?.processor
                    .filter((p) => {
                        return stateProcessors.data?.find((pc) => pc.id === p.id);
                    })
                    .map((p) => {
                        return p.id + '';
                    }) ?? [];

            setProcessors(processorsData);
            form.setFieldValue('processor', processorsData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateProcessors.isSuccess]);

    useEffect(() => {
        form.setFieldValue('color', []);
        if (stateColors.isSuccess && stateColors.data) {
            const colorsData =
                props.data?.color
                    .filter((c) => {
                        return stateColors.data?.find((cl) => cl.id === c.id);
                    })
                    .map((c) => {
                        return c.id + '';
                    }) ?? [];

            setColors(colorsData);
            form.setFieldValue('color', colorsData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateColors.isSuccess]);

    useEffect(() => {
        form.setFieldValue('paymentMethod', []);
        if (statePaymentMethods.isSuccess && statePaymentMethods.data) {
            const paymentMethodsData =
                props.data?.paymentMethod
                    .filter((c) => {
                        return statePaymentMethods.data?.find((cl) => cl.id === c.id);
                    })
                    .map((c) => {
                        return c.id + '';
                    }) ?? [];

            setPaymentMethods(paymentMethodsData);
            form.setFieldValue('paymentMethod', paymentMethodsData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statePaymentMethods.isSuccess]);

    const onFinish = (values: ProductModel) => {
        if (
            !textEditor ||
            (typeof textEditor === 'string' &&
                (textEditor.length === 0 || textEditor === '<p><br></p>'))
        ) {
            setRequiredTextEditor(true);
            return;
        }

        const colorsData: ColorModel[] =
            stateColors.data
                ?.filter((c) => {
                    return colors.find((cl) => +cl === c.id);
                })
                .map((x) => {
                    return { id: x.id };
                }) ?? [];

        const memorySizesData: MemorySizeModel[] =
            stateMemorySizes.data
                ?.filter((m) => {
                    return memorySizes.find((ms) => +ms === m.id);
                })
                .map((x) => {
                    return { id: x.id };
                }) ?? [];

        const paymentMethodsData: PaymentMethodModel[] =
            statePaymentMethods.data
                ?.filter((p) => {
                    return paymentMethods.find((pm) => +pm === p.id);
                })
                .map((x) => {
                    return { id: x.id };
                }) ?? [];

        const processorsData: ProcessorModel[] =
            stateProcessors.data
                ?.filter((p) => {
                    return processors.find((pc) => +pc === p.id);
                })
                .map((x) => {
                    return { id: x.id };
                }) ?? [];

        props.onSubmit({
            ...values,
            id: props.data?.id,
            status: values.status === 'ACTIVO' ? 1 : 0,
            specification: textEditor,
            color: colorsData,
            memorySize: memorySizesData,
            paymentMethod: paymentMethodsData,
            processor: processorsData,
        });
    };

    const onFinishFailed = () => {
        if (
            !textEditor ||
            (typeof textEditor === 'string' &&
                (textEditor.length === 0 || textEditor === '<p><br></p>'))
        ) {
            setRequiredTextEditor(true);
            return;
        }
    };

    return (
        <Wrapper className="kp-card">
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                initialValues={
                    props.action === 'save'
                        ? { status: 'ACTIVO' }
                        : {
                              ...props.data,
                              status: props.data?.status === 1 ? 'ACTIVO' : 'INACTIVO',
                              category: { id: props.data?.category.id?.toString() },
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
                                {
                                    validator: (_, value) => validateNumbers(value),
                                },
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
                                {
                                    validator: (_, value) =>
                                        validateDecimalNumbers(value),
                                },
                            ]}
                        >
                            <KPInput placeholder="$0.00" />
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
                            <Select loading={stateCategories.isLoading}>
                                {stateCategories.data?.map((c) => (
                                    <Select.Option key={c.id}>{c.name}</Select.Option>
                                ))}
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
                            name="memorySize"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                loading={stateMemorySizes.isLoading}
                                onChange={setMemorySizes}
                            >
                                {stateMemorySizes.data?.map((m) => (
                                    <Select.Option key={m.id}>{m.value}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="processor">
                            Procesador<span>*</span>
                        </label>
                        <Form.Item
                            hasFeedback
                            name="processor"
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                loading={stateProcessors.isLoading}
                                onChange={setProcessors}
                            >
                                {stateProcessors.data?.map((p) => (
                                    <Select.Option key={p.id}>{p.name}</Select.Option>
                                ))}
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
                            name="color"
                            hasFeedback
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                loading={stateColors.isLoading}
                                onChange={setColors}
                            >
                                {stateColors.data?.map((c) => (
                                    <Select.Option key={c.id}>
                                        <div
                                            style={{
                                                background: c.value,
                                            }}
                                            className="color-item"
                                        >
                                            {c.value}
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="kp-column">
                        <label htmlFor="payMethod">
                            Metodos de pago<span>*</span>
                        </label>
                        <Form.Item
                            name="paymentMethod"
                            hasFeedback
                            rules={[
                                { required: true, message: 'Este campo es requerido' },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                loading={statePaymentMethods.isLoading}
                                onChange={setPaymentMethods}
                            >
                                {statePaymentMethods.data?.map((x) => (
                                    <Select.Option key={x.id}>{x.name}</Select.Option>
                                ))}
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
                    <KPEditor
                        value={textEditor}
                        onSetValue={setTextEditor}
                        required={requiredTextEditor}
                        onSetRequired={setRequiredTextEditor}
                    />
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
