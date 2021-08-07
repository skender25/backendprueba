import { IUser } from './user.interface';

export interface IVariables {
    id?: string | number;
    product?: string;
    productor?: string;
    user?: IUser;
}