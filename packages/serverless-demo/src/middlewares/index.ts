import compose from 'koa-compose';

import {
    router
} from './router';

export const middlewares = compose([
    router.routes(),
    router.allowedMethods()
])