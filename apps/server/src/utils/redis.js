import logger from '../lib/winston/index.js'


export const getRedisClient = (req)=>{

  if(req && req.redisClient){
    return req.redisClient;
  }else{
    throw new Error('Redis Client not found!');
  }
}


export const cacheData = async (key,data,ttl=3600,req)=>{
   try{
    const client = getRedisClient(req);
    await client.setEx(key,ttl,JSON.stringify(data));
   }catch(error){
     logger.error('Redis cache error',error);
     throw error;
   }
}

export const getCacheData = async (key,req) =>{
  try{
    const client = getRedisClient(req);
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }catch(error){
    logger.error('Redis error while get data ',error);
    throw error;
  }
}


export const deleteCacheData = async (key,req)=>{
  try{
    const client = getRedisClient(req);
    await client.del(key);
    logger.info(`Cache deleted for key: ${key}`);
  }catch(error){
     logger.error('Redis delete cache error',error);
     throw error;
  }
}

export const deleteAllCache = async (pattern,req)=>{
  try{
    const client = getRedisClient(req);
    const keys = await client.keys(pattern);

    if(keys && keys.length > 0){
       await Promise.all(keys.map(key=>client.del(key)));
       logger.info('All cache deleted successfully');
    }
  }catch(error){
    logger.error('Redis delete pattern error: ',error);
    throw error;
  }
}
