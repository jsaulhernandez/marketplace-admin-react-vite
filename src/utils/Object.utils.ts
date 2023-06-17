type generic = { [k in string]: PropertyKey };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type genericData = { [k in string]: any };

export interface CustomHeader<T extends genericData> {
    title: string;
    dataKey?: string;
    render?: (record: T, index?: number) => string;
}

export const getDataFormatByHeaders = <T extends genericData>(
    header: CustomHeader<T>[],
    array: T[],
): generic[] => {
    if (!array) return [];
    if (array.length === 0) return [];
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
