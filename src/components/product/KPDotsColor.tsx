import { FC } from 'react';

import styled from 'styled-components';

import { ColorModel } from '../../interfaces/Color.model';

export interface KPDotsColorProps {
    colors?: ColorModel[];
    className?: string;
}

const KPDotsColor: FC<KPDotsColorProps> = (props) => {
    return (
        <div className="flex flex-row flex-wrap g-10 mt-1">
            {props.colors?.map((x, i) => (
                <Dot color={x.value} key={i} />
            ))}
        </div>
    );
};

const Dot = styled.div<{
    color?: string;
}>`
    width: 25px;
    height: 25px;
    background-color: ${({ color }) => color ?? 'transparent'};
    border-radius: 50px;
`;

export default KPDotsColor;
