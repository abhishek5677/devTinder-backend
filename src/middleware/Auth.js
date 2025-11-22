const adminAuth =
  ("/admin",
  (req, res, next) => {
    const token = "xyz";
    const AuthToken = token === "xyz";
    console.log("check admin auth token");

    if (AuthToken) {
      next();
    } else {
      res.status(401).send("Unauthorized Access");
    }
  });

const userAuth =
  ("/user",
  (req, res, next) => {
    const token = "xyz";
    const AuthToken = token === "xyz";
    console.log("check user auth token");

    if (AuthToken) {
      next();
    } else {
      res.status(401).send("Unauthorized Access");
    }
  });

module.exports = { adminAuth, userAuth };
