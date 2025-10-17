import jwt from "jsonwebtoken";

export const middlewareController = {
  //verify token
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.MY_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(401).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(404).json("You're not authenticated");
    }
  },
  verifyAdminToken: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not allow to delete other");
      }
    });
  },
};
