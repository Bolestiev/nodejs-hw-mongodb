import createHttpError from 'http-errors';

export const validateBody = (shema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad request', {
      errors: err.details.map((e) => ({
        error: e.message,
        path: e.path,
      })),
    });
    next(error);
  }
};
