import { z } from "zod";

export const useZod = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formValidation = error.errors
        .map((err) => ({
          field: err.path.join("."),
          errors: [err.message],
        }))
        // remove any error that has no field
        .filter((x) => x.field);

      return res.status(400).json({
        error: true,
        message: "Validation error, please provide valid data",
        ...(formValidation.length > 0 && { formValidation }),
      });
    }
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export default useZod;
