import { findOneElement , asignDocumentId } from './../lib/db-operations';
import { COLLECTIONS } from '../config/constans';
import { IContextData } from '../interfaces/context-data.interface';
import ResolversOperationsService from './resolvers-operations.services';
import slugify from 'slugify';


class ProductsService extends ResolversOperationsService {
    collection = COLLECTIONS.PRODUCTS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    async items() {
        const result = await this.list(this.collection, 'productos');
        return { status: result.status, message: result.message, products: result.items };
    }

    async details() {
        const result = await this.get(this.collection);
        return { status: result.status, message: result.message, product: result.item };
    }

    async insert() {
        const product = this.getVariables().product;
        const productor = this.getVariables().productor;
        // Comprobar que no está en blanco ni es indefinido
        if (!this.checkData(product || '')) {
            return {
                status: false,
                message: 'El género no se ha especificado correctamente',
                product: null
            };
        }
        // COmprobar que no existe
        if (await this.checkInDatabase( product || '')) {
            return {
                status: false,
                message: 'El género existe en la base de datos, intenta con otro género',
                product: null
            };
        }
        // Si valida las opciones anteriores, venir aquí y crear el documento
        const productObject = {
            id: await asignDocumentId(this.getDb(), this.collection, { id: -1}),
            name: product,
            productor: slugify(productor || '', { lower: true })
        };
        const result = await this.add(this.collection, productObject, 'productos');
        return { status: result.status, message: result.message, product: result.item };
    }
  
    async modify() {
        const id = this.getVariables().id;
        const product = this.getVariables().product;

        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'El ID del género no se ha especificado correctamente',
                genre: null
            };
        }
        if (!this.checkData(product || '')) {
            return {
                status: false,
                message: 'El género no se ha especificado correctamente',
                product: null
            };
        }
        const objectUpdate = { 
            name: product ,
            productor: slugify(product || '', {lower: true})
        };
        
        const result = await this.update(this.collection, { id }, objectUpdate, 'productos');
        return { status: result.status, message: result.message, product: result.item };
    }

    async delete() {
        const id = this.getVariables().id;
        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'El ID del género no se ha especificado correctamente',
                product: null
            };
        }
        const result = await this.del(this.collection, { id }, 'product');
        return { status: result.status, message: result.message };
    }

    private checkData(value: string) {
        return (value === '' || value === undefined) ? false: true;
    }

    private async checkInDatabase(value: string) {
        return await findOneElement(this.getDb(), this.collection, {
            name: value
        });
    }
}

export default ProductsService;