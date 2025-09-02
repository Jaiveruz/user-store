import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { CategoryRoutes } from './category/route';
import { ProductsRoutes } from './products/route';
import { FileUploadRoutes } from './file-upload/route';
import { ImageRoute } from './images/route';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', Authroutes.routes );
    router.use('/api/categories', CategoryRoutes.routes );
    router.use('/api/products', ProductsRoutes.routes ); 
    router.use('/api/upload', FileUploadRoutes.routes );
    router.use('/api/images', ImageRoute.routes );



    return router;
  }


}

