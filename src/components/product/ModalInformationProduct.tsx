import { FC, useEffect, useRef } from 'react';
import { Modal, Tag } from 'antd';

import KPText from '@components/KPText';
import KPButton from '@components/KPButton';
import KPDotsColor from './KPDotsColor';

import { ProductModel } from '@interfaces/Product.model';
import styled from 'styled-components';

interface ModalInformationProductProps {
    data?: ProductModel;
    onClose: (value: boolean) => void;
    open: boolean;
}

const ModalInformationProduct: FC<ModalInformationProductProps> = (props) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (spanRef.current)
            if (props.data?.specification)
                spanRef.current.innerHTML = props.data.specification;
    }, [props.data?.specification]);

    return (
        <WrapperModal
            title={
                <div className="ModalInformationProduct_header flex justify-start items-center wp-100">
                    <KPText
                        text="Información de producto"
                        fontWeight={700}
                        fontSize={16}
                        textColor="--secondary-color"
                    />
                </div>
            }
            open={props.open}
            onCancel={() => props.onClose(!props.open)}
            footer={null}
        >
            <div className="ModalInformationProduct_body flex flex-column wp-100 g-10">
                {props.data?.detail && (
                    <div className="ModalInformationProduct_item flex flex-column">
                        <KPText text="Detalle" fontWeight={700} />
                        <KPText text={props.data?.detail ?? ''} />
                    </div>
                )}

                {props.data?.specification && (
                    <div className="ModalInformationProduct_item flex flex-column">
                        <KPText text="Especificaciones" fontWeight={700} />
                        <span className="specification" ref={spanRef} />
                    </div>
                )}

                {props.data?.color && props.data.color.length > 0 && (
                    <div className="ModalInformationProduct_item flex flex-column">
                        <KPText text="Colores" fontWeight={700} />
                        <KPDotsColor colors={props.data.color} />
                    </div>
                )}

                {props.data?.processor && props.data.processor.length > 0 && (
                    <div className="ModalInformationProduct_item flex flex-column">
                        <KPText text="Procesadores" fontWeight={700} />
                        <div className="flex flex-row flex-wrap g-10">
                            {props.data?.processor.map((p, i) => (
                                <KPButton
                                    className="mt-1"
                                    type="primary"
                                    theme="dark"
                                    key={i}
                                >
                                    {p.name}
                                </KPButton>
                            ))}
                        </div>
                    </div>
                )}

                {props.data?.memorySize && props.data.memorySize.length > 0 && (
                    <div className="ModalInformationProduct_item flex flex-column">
                        <KPText text="Tamaños de memorias" fontWeight={700} />
                        <div className="flex flex-row flex-wrap g-10">
                            {props.data?.memorySize.map((m, i) => (
                                <KPButton
                                    className="mt-1"
                                    type="primary"
                                    theme="dark"
                                    key={i}
                                >
                                    {m.value}
                                </KPButton>
                            ))}
                        </div>
                    </div>
                )}

                {props.data?.paymentMethod && props.data.paymentMethod.length > 0 && (
                    <div className="ModalInformationProduct_item flex flex-column">
                        <KPText text="Formas de pago" fontWeight={700} />
                        <div className="flex flex-row flex-wrap g-10">
                            {props.data?.paymentMethod.map((p, i) => (
                                <Tag className="tag mt-1" key={i}>
                                    <KPText text={p.name} textColor="--secondary-color" />
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </WrapperModal>
    );
};

const WrapperModal = styled(Modal)`
    top: 20px;

    .ant-modal-content {
        padding: 0px;
    }

    .ModalInformationProduct_header {
        background-color: var(--primary-color);
        height: 50px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        padding-left: 24px;
    }

    .ModalInformationProduct_body {
        padding: 20px 24px;

        .specification {
            color: var(--secondary-text-color);
            font-size: 14px;
            font-weight: normal !important;
            letter-spacing: 0px;
            margin: 0px;
            text-decoration: none;
            text-align: left;

            p strong {
                text-decoration: underline;
            }

            ul {
                padding-left: 30px;
            }
        }
    }

    .tag {
        padding: 5px 10px;
        border-radius: 10px;
        border: 0px;
        background-color: var(--primary-color);
    }
`;

export default ModalInformationProduct;
