import Router from 'koa-router';
import {
    HomeController
} from '@/controller/home';

import { PostController } from '@/controller/post';

export
const router = new Router();

router.get('/', HomeController);

router.get('/post/:id', PostController)

// router.get('/:id', )