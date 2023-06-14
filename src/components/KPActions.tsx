import { FC } from 'react';

import { Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import KPButton from './KPButton';

interface KPActionsProps {
    onEdit?: () => void;
    onRemove?: () => void;
}

const KPActions: FC<KPActionsProps> = (props) => {
    return (
        <Wrapper className="flex">
            <Tooltip
                placement="bottom"
                title={
                    <>
                        <EditOutlined />
                        &nbsp;Editar
                    </>
                }
            >
                <div>
                    <KPButton
                        onClick={props.onEdit}
                        type="link"
                        prefix={<EditOutlined className="icon" />}
                    />
                </div>
            </Tooltip>
            <Tooltip
                placement="bottom"
                title={
                    <>
                        <DeleteOutlined />
                        &nbsp;Eliminar
                    </>
                }
            >
                <div>
                    <KPButton
                        onClick={props.onRemove}
                        type="link"
                        prefix={<DeleteOutlined className="icon" />}
                    />
                </div>
            </Tooltip>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    .icon {
        transform: scale(1.6);
    }
`;

export default KPActions;
