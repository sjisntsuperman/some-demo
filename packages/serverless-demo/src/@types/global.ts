import Koa from 'koa';

declare global{
    interface CustomT {
        [propName: string]: any;
      }
    
    type ServerMiddleware = Koa.Middleware<{}, CustomT>;
    type Controller = ServerMiddleware;
}
