import type { ZodSchema } from 'zod';

export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string, public details: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      'Request body failed validation',
      result.error.flatten().fieldErrors,
    );
  }
  return result.data;
}
