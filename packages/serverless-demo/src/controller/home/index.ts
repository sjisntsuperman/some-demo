import Koa from 'koa';
import path from 'path';
import {HomeService} from '@/service/home';
import template from 'art-template';

import {
    getTemplate,
    getCssTemplate
} from '@/assets/render';

const render=(html:string, blogList:object[])=>{
    return template.render(html, {
        blogList: blogList,
        githubcss: getCssTemplate().githubcss,
        homecss: getCssTemplate().homecss
    })
}

const homeTemplate=getTemplate(path.join(__dirname, '../../views/home/index.html'));

export const HomeController:Koa.Middleware<{}, {[propName: string]: any}> = async (ctx)=>{
    const homeService = new HomeService();
    const blogList=await homeService.getList();
    ctx.body=render(homeTemplate, blogList);
}