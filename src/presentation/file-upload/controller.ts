import { Response, Request } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";



export class FileUploadController {

    constructor(
        private readonly fileUploadService: FileUploadService
    ) {}

    private handleError = (error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' })
    }

    uploadFile =  async (req: Request, res: Response) => {
        
        const types = req.params.type;
        const validTypes = ['users', 'products', 'categories'];

        if ( !validTypes.includes(types) ) {
            return res.status(400).json({ error: `Invalid type. Allowed types: ${validTypes.join(', ')}` });
        }

        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService.uploadSingleFile( file, `uploads/${types}` )
            .then( uploaded => res.json(uploaded))
            .catch( error => this.handleError(error, res));
    };

    uploadMultipleFiles = async (req: Request, res: Response) => {
        res.json('upload multiple files')
    };
}