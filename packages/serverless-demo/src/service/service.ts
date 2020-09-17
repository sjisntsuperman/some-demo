import {
    EntityManager,
    getManager,
    getConnection,
    SelectQueryBuilder
  } from 'typeorm';
  
  export class Service {
    protected manager: EntityManager;
    protected queryBuild: SelectQueryBuilder<any>;
    public constructor() {
      // 连接异常
      try {
        this.manager = getManager();
        this.queryBuild = getConnection().createQueryBuilder();
      } catch (err) {
          console.error(err);
      }
    }
  }
  