import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class Article{
    @Column({
        type: 'varchar',
        length: 32
    })
    public title:string;
    
    @PrimaryGeneratedColumn({
        type:'int'
    })
    public id:number;

    @Column({
        type: 'varchar',
        length: 32
    })
    public author:string;

    @Column({
        type: 'varchar',
        length: 32
    })
    public content:string;

    @UpdateDateColumn({
        type: 'date',
        default: new Date()
    })
    public date:Date;
}