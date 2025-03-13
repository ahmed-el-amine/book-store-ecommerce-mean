export const redisMiddleware = (req,res,next)=>{
  req.redisClient = req.app.get('redisClient');
  next();
}
