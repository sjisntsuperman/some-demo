import Koa from 'koa';
import path from 'path';
import {HomeService} from '@/service/home';
import template from 'art-template';

import {
    getTemplate,
    getCssTemplate
} from '@/assets/render';

const render=(html:string, blog:object)=>{
    return template.render(html, {
        blog: blog,
        githubcss: getCssTemplate().githubcss,
        postcss: getCssTemplate().postcss
    })
}

const postTemplate=getTemplate(path.join(__dirname, '../../views/post/index.html'));

export const PostController:Koa.Middleware<{}, {[propName: string]: any}> = async (ctx)=>{
    const homeService = new HomeService();
    const id = ctx.params.id;
    const blog=await homeService.getPost(id);
    ctx.body=render(postTemplate, blog);
}