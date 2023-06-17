/* eslint-disable @typescript-eslint/ban-types */

type generic = { [k in string]: string };

export interface CustomHeader<T extends Object> {
    title: string;
    dataKey: string;
    render?: (record: T, index: number) => string;
}

export const getDataFormat = <T extends generic>(
    header: CustomHeader<T>[],
    array: T[],
): generic[] => {
    if (!array) return [];
    // eslint-disable-next-line prefer-const
    let data: generic[] = [];
    let format = {};

    array.forEach((item, index) => {
        header.forEach((h) => {
            if (h.dataKey) {
                format = { ...format, [h.title]: item[h.dataKey] };
                return;
            }

            if (h.render) {
                format = { ...format, [h.title]: h.render(item, index) };
            }
        });

        data.push(format);
        format = {};
    });

    return data;
};
