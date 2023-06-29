import { TypeDocumentModel } from './TypeDocument.model';
import { UserModel } from './User.model';

export interface CustomerModel {
    id: number;
    firstName: string;
    secondName: string;
    firstLastName: string;
    secondLastName: string;
    dateBirth: string;
    typeDocument: TypeDocumentModel;
    document: string;
    phone: string;
    terms: number;
    user: UserModel;
}
