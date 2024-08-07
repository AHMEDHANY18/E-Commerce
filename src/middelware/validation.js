const dataMethod = ["body", "params", "query", "file", "files"];

export const validate = (schema) => {
  return (req, res, next) => {
    let arrayErrors = [];

    dataMethod.forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });
        if (error?.details) {
          arrayErrors.push(error.details);
        }
      }
    });

    if (arrayErrors.length) {
      return res.status(422).json({ msg: "Validation failed", errors: arrayErrors });
    }

    next();
  };
};
