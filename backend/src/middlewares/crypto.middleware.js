import { encrypt, decrypt } from "../services/crypto.service";

const cryptoDecrypt = () => {
  return (req, res, next) => {
    try {
      if (!req.body || !req.body.iv) {
        return res.status(400).json({ message: "Encrypted payload missing" });
      }

      req.body = decrypt(req.body);

      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid encrypted payload" });
    }
  };
};

// router.post(
//   "/checklogin",
//   crypto.cryptoDecrypt(),
//   validator(validation.loginSchemas.checklogin, "body"),
//   controller.checklogin(iocContainer)
// );

const cryptoEncrypt = (data) => {
  return encrypt(data);
};

const encryptResponseMiddleware = () => {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      const encrypted = encrypt(data);
      return originalJson.call(this, encrypted);
    };

    next();
  };
};

// 🔥 If You Also Want Response Encryption
// router.post(
//   "/checklogin",
//   crypto.cryptoDecrypt(),
//   crypto.encryptResponseMiddleware(),
//   validator(validation.loginSchemas.checklogin, "body"),
//   controller.checklogin(iocContainer)
// );

export { cryptoDecrypt, cryptoEncrypt, encryptResponseMiddleware };
