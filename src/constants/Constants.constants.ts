export const API_URL: string = import.meta.env.VITE_API_URL;
export type SHOWING = 'Form' | 'Table';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
export type ModalActionsType = 'success' | 'error' | 'info' | 'confirm';
export type TypeButton = 'primary' | 'secondary' | 'link' | 'danger';
export type UserActions = 'get' | 'save' | 'update' | 'delete';
export const UnitsMeasurementStorageSize = Object.freeze([
    { key: 'MB', value: 'Megabyte' },
    { key: 'GB', value: 'Gigabyte' },
    { key: 'TB', value: 'Terabyte' },
]);
