import moduleAlias from 'module-alias';
import path from 'path';

const basePath=path.join(__dirname,'../');

// console.log(basePath);

moduleAlias.addAlias('@', basePath);
