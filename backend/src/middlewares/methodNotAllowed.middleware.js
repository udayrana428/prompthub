const methodNotAllowed = (app) => {
  return (req, res, next) => {
    let allowed = [];

    const checkLayer = (layer, prefix = "") => {
      if (layer.route) {
        const fullPath = prefix + layer.route.path;

        // Create a regex from the path pattern to match params
        const pattern = fullPath.replace(/:([^/]+)/g, "([^/]+)");
        const regex = new RegExp(`^${pattern}$`);

        if (regex.test(req.path)) {
          allowed.push(...Object.keys(layer.route.methods));
        }
      }

      if (layer.name === "router" && layer.handle.stack) {
        layer.handle.stack.forEach((sub) =>
          checkLayer(
            sub,
            prefix + (layer.regexp?.fast_slash ? "" : layer.path || ""),
          ),
        );
      }
    };

    app._router.stack.forEach((layer) => checkLayer(layer));

    if (allowed.length > 0 && !allowed.includes(req.method.toLowerCase())) {
      return next({
        status: 405,
        allowed,
        message: `Method ${req.method} not allowed for ${
          req.path
        }. Allowed: ${allowed.join(", ").toUpperCase()}`,
      });
    }

    next();
  };
};

export { methodNotAllowed };
