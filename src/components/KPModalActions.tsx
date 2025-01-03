import { FC, ReactNode, useEffect } from 'react';

import { Modal } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

import KPButton from './KPButton';

import { ModalActionsType, TypeButton } from '@constants/Constants.constants';

interface KPModalActionsProps {
    type: ModalActionsType;
    title?: ReactNode;
    body?: ReactNode;
    open: boolean;
    onClose?: (value: boolean) => void;
    onConfirm?: () => void;
    loading?: boolean;
    typeButton?: TypeButton;
    textConfirm?: string;
}

const KPModalActions: FC<KPModalActionsProps> = (props) => {
    useEffect(() => {
        if (props.type === 'success') {
            setTimeout(() => {
                props.onClose && props.onClose(false);
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.type]);

    return (
        <WrapperModal
            open={props.open}
            onCancel={() => props.onClose && props.onClose(!props.open)}
            footer={null}
        >
            <div className="KPModalActions flex flex-column items-center justify-center g-20 mt-2">
                <div className="KPModalActions_icon">
                    {props.type === 'confirm' && (
                        <QuestionCircleOutlined className="confirm" />
                    )}
                    {props.type === 'success' && (
                        <CheckCircleOutlined className="success" />
                    )}
                    {props.type === 'info' && <InfoCircleOutlined className="info" />}
                    {props.type === 'error' && <CloseCircleOutlined className="error" />}
                </div>
                <div className="KPModalActions_title">{props.title}</div>
                {props.body && <div className="KPModalActions_body">{props.body}</div>}
                <div className="KPModalActions_button flex g-10">
                    <KPButton
                        type="link"
                        onClick={() => props.onClose && props.onClose(!props.open)}
                    >
                        {props.type === 'confirm' ? 'Cancelar' : 'Cerrar'}
                    </KPButton>
                    {props.type === 'confirm' && (
                        <KPButton
                            type={props.typeButton ?? 'primary'}
                            onClick={() => props.onConfirm && props.onConfirm()}
                            loading={props.loading}
                        >
                            {props.textConfirm && props.type === 'confirm'
                                ? props.textConfirm
                                : 'Aceptar'}
                        </KPButton>
                    )}
                </div>
            </div>
        </WrapperModal>
    );
};

const WrapperModal = styled(Modal)`
    .KPModalActions_icon .confirm,
    .KPModalActions_icon .success,
    .KPModalActions_icon .info,
    .KPModalActions_icon .error {
        transform: scale(3);
    }

    .KPModalActions_icon .confirm {
        color: #faad14;
    }

    .KPModalActions_icon .success {
        color: #52c41a;
    }

    .KPModalActions_icon .info {
        color: #1677ff;
    }

    .KPModalActions_icon .error {
        color: #ff4d4f;
    }

    .KPModalActions_title {
        font-size: 18px;
        font-weight: 700 !important;
        text-align: center;
    }
`;

export default KPModalActions;
