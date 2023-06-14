import { ReactNode } from 'react';

import { notification } from 'antd';
import {
    CheckOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';

import { NotificationType } from '@constants/Constants.constants';

const getIconNotification = (type: NotificationType) => {
    return {
        success: (
            <CheckOutlined style={{ transform: 'scale(1.5)', ...getColorIcon(type) }} />
        ),
        warning: (
            <WarningOutlined style={{ transform: 'scale(1.5)', ...getColorIcon(type) }} />
        ),
        error: (
            <ExclamationCircleOutlined
                style={{ transform: 'scale(1.5)', ...getColorIcon(type) }}
            />
        ),
        info: (
            <InfoCircleOutlined
                style={{ transform: 'scale(1.5)', ...getColorIcon(type) }}
            />
        ),
    }[type];
};

const getColorIcon = (type: NotificationType) => {
    return {
        success: {
            color: '#52C41A',
        },
        warning: {
            color: '#FAAD14',
        },
        error: {
            color: '#FF4D4F',
        },
        info: {
            color: '#1677FF',
        },
    }[type];
};

// const getNotificationStyle = (type: NotificationType) => {
//     return {
//         success: {
//             color: '#52C41A',
//             border: '1px solid #52C41A',
//             backgroundColor: '#52C41A',
//         },
//         warning: {
//             color: '#FAAD14',
//             border: '1px solid #FAAD14',
//             backgroundColor: '#FAAD14',
//         },
//         error: {
//             color: '#FF4D4F',
//             border: '1px solid #FF4D4F',
//             backgroundColor: '#FF4D4F',
//         },
//         info: {
//             color: '#1677FF',
//             border: '1px solid #1677FF',
//             backgroundColor: '#1677FF',
//         },
//     }[type];
// };

const Toast = (
    type: NotificationType,
    title?: ReactNode,
    content?: ReactNode,
    placement?: 'topRight',
) => {
    notification.open({
        message: title,
        description: content,
        // style: getNotificationStyle(type),
        duration: 5,
        icon: getIconNotification(type),
        placement,
        type: type,
    });
};

export default Toast;
