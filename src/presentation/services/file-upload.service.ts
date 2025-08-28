


export class FileUploadService {


    constructor() {}

    private checkFolder( folderPath: string ) {
        throw new Error("Method not implemented.");
    }

    uploadSingleFile(
        file: ?,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {}

    uploadMultiple(
        file: ?,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {}

}