module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res).catch(next);
  };
};
