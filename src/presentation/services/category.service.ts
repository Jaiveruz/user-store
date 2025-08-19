import { CategoryModel } from '../../data';
import { CustomError, UserEntity } from '../../domain';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';


export class CategoryService {

    constructor() {}

    async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ) {

        const categoryExist = await CategoryModel.findOne({ name: createCategoryDto.name });
        if ( categoryExist ) throw CustomError.badRequest('Category already exists');

        try {

            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${ error }`);
        }

    }

    async getCategory( paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        try {

            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            //     .skip((page - 1) * limit)
            //     .limit(limit);
            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);

            return {
                total,
                page,
                limit,
                next: `/api/categories?page=${ page + 1 }&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `/api/categories?page=${ page - 1 }&limit=${ limit }` : null,
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))
            };

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${ error }`);
        }
    }

}