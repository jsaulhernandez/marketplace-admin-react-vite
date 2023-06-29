import { CustomerModel } from './Customer.model';

export enum UserStatus {
    ACTIVE = 'ACTIVE', //ESTADO DE EL USUARIO CUANDO ESTA ACTIVO
    BLOCKED = 'BLOCKED', //ESTADO DE EL USUARIO CUANDO ESTA BLOQUEADO POR EMAIL O PASSWORD EQUIVOCADO
    INACTIVE = 'INACTIVE', //ESTADO DE EL USUARIO CUANDO ESTA INACTIVO, SU CUENTA HA SIDO DADA DE BAJA
    BLOCKED_PERMANENT = 'BLOCKED_PERMANENT', //ESTADO DEL USUARIO CUANDO ESTA BLOQUEADO PERMANENTEMENTE, HA SIDO BLOQUEADO DESDE EL ADMIN, SIN POSIBILIDAD DE PODER INGRESAR
}

export interface UserModel {
    id: number;
    email: string;
    password: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    verifiedEmail: number;
    customer: CustomerModel;
}
