import { FC, ReactNode } from 'react';

import styled, { css } from 'styled-components';

type textType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'div';
type decoration = 'line-through' | 'underline' | 'overline';
type decorationColor = 'red' | 'grey' | 'black';
type TextAlign = 'center' | 'end' | 'start' | 'left' | 'right' | 'justify';

export interface KPTextProps {
    text: string | ReactNode;
    textColor?: string;
    type?: textType;
    fontSize?: number;
    fontWeight?: number;
    letterSpacing?: number;
    textDecoration?: decoration;
    textDecorationColor?: decorationColor;
    margin?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    className?: string;
    onClick?: () => void;
    textAlign?: TextAlign;
}

const KPText: FC<KPTextProps> = (props) => {
    if (props.type === 'h1') return <H1Wrapper {...props}>{props.text}</H1Wrapper>;
    if (props.type === 'h2') return <H2Wrapper {...props}>{props.text}</H2Wrapper>;
    if (props.type === 'h3') return <H3Wrapper {...props}>{props.text}</H3Wrapper>;
    if (props.type === 'h4') return <H4Wrapper {...props}>{props.text}</H4Wrapper>;
    if (props.type === 'h5') return <H5Wrapper {...props}>{props.text}</H5Wrapper>;
    if (props.type === 'div') return <DivWrapper {...props}>{props.text}</DivWrapper>;

    return <PWrapper {...props}>{props.text}</PWrapper>;
};

const getTextColor = (textColor?: string) => {
    if (textColor) {
        if (textColor.includes('--')) return `var(${textColor})`;

        return `${textColor}`;
    }

    return 'var(--secondary-text-color)';
};

const getFontSize = (fontSize?: number) => {
    if (fontSize) return `${fontSize}px !important`;
    return '14px';
};

const getFontWeight = (fontWeight?: number) => {
    if (fontWeight) return `${fontWeight} !important`;
    return 'normal !important';
};

const getLetterSpacing = (letterSpacing?: number) => {
    if (letterSpacing) return `${letterSpacing}px !important`;
    return '0px';
};

const getMargin = (margin?: number) => {
    if (margin) return `${margin}px !important`;
    return '0';
};

const getTextDecoration = (textDecoration?: string) => {
    if (textDecoration) return textDecoration;
    return 'none';
};

const getTextDecorationColor = (textDecorationColor?: string) => {
    if (textDecorationColor) return textDecorationColor;
    return 'none';
};

const styles = css<Omit<KPTextProps, 'onClick' | 'className' | 'text'>>`
    color: ${({ textColor }) => getTextColor(textColor)};
    font-size: ${({ fontSize }) => getFontSize(fontSize)};
    font-weight: ${({ fontWeight }) => getFontWeight(fontWeight)};
    letter-spacing: ${({ letterSpacing }) => getLetterSpacing(letterSpacing)};
    margin: ${({ margin }) => getMargin(margin)};
    margin-top: ${({ marginTop }) => getMargin(marginTop)};
    margin-right: ${({ marginRight }) => getMargin(marginRight)};
    margin-bottom: ${({ marginBottom }) => getMargin(marginBottom)};
    margin-left: ${({ marginLeft }) => getMargin(marginLeft)};
    text-decoration: ${({ textDecoration }) => getTextDecoration(textDecoration)};
    text-decoration-color: ${({ textDecorationColor }) =>
        getTextDecorationColor(textDecorationColor)};
    text-align: ${({ textAlign }) => (textAlign ? textAlign : 'left')};
`;

const H1Wrapper = styled.h1`
    ${styles}
`;
const H2Wrapper = styled.h2`
    ${styles}
`;
const H3Wrapper = styled.h3`
    ${styles}
`;
const H4Wrapper = styled.h4`
    ${styles}
`;
const H5Wrapper = styled.h5`
    ${styles}
`;
const PWrapper = styled.p`
    ${styles}
`;
const DivWrapper = styled.div`
    span {
        ${styles}
    }
`;

export default KPText;
