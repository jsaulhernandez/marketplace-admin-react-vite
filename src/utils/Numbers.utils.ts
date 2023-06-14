export const formatMoney = (value?: number) => {
    if (!value) return '--';

    return new Intl.NumberFormat('en', {
        currencySign: 'accounting',
        style: 'currency',
        currency: 'USD',
    }).format(value);
};
