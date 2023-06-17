import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment';

const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const date = moment(new Date()).format('MMMM d, YYYY');

// eslint-disable-next-line @typescript-eslint/ban-types
export const exportToExcel = <T extends Object>(
    customData: T[],
    fileName = `Generado`,
) => {
    const ws = XLSX.utils.json_to_sheet(JSON.parse(JSON.stringify(customData)));
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `${fileName} ${date + fileExtension}`);
};
