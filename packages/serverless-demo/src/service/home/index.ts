import {Service} from '../service';
import {Article} from '@/models/home/home';

type ArticleInfo= {
    title?: string,
    author?: string,
    date?: Date,
    content?: string
}

export
class HomeService extends Service{
    constructor(){
        super();
    }

    public async post(params:ArticleInfo){
        let article = new Article();
        article.content = params.content;
        article.author = params.author;
        article.title = params.title;
        article.date = new Date();
        article = await this.manager.save(article);
    }

    public async getPost(id: number){
        const article = await this.manager.findOne(Article, {
            where: {
                id: id
            }
        });
        return article;
    }

    public async getList(){
        const articles=await this.manager.find(Article);
        return articles;
    }
}