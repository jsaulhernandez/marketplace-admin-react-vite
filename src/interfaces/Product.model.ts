import { CategoryModel } from './Category.model';
import { ColorModel } from './Color.model';
import { MemorySizeModel } from './MemorySize.model';
import { PayMethodModel } from './PayMethod.model';
import { ProcessorModel } from './Processor.model';

export interface ProductModel {
    id: number;
    name: string;
    title: string;
    description: string;
    image: string;
    stock: number;
    price: number;
    status: number;
    detail: string;
    specification: string;
    memorySize: MemorySizeModel[];
    color: ColorModel[];
    processor: ProcessorModel[];
    category: CategoryModel;
    payMethod: PayMethodModel[];
}