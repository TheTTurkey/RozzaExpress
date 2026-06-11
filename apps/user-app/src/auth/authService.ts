import { RosminiEmailSchema } from '@rozza-express/shared';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Validates a student email during the Rosmini Google Sign-in flow.
 * Enforces that:
 * 1. The email format is valid.
 * 2. The email ends with `@rosmini.school.nz`.
 * 3. The local part starts with a digit/number (e.g. "24015").
 * 
 * @param email The student email address to validate.
 * @param name The student's name from Google Sign-In.
 * @returns A validated AuthUser object.
 * @throws Error with a user-facing explanation if validation fails.
 */
export function validateRosminiSignIn(email: string, name: string): AuthUser {
  const cleanEmail = email.trim().toLowerCase();
  const validationResult = RosminiEmailSchema.safeParse(cleanEmail);

  if (!validationResult.success) {
    const defaultMsg = 'Invalid Rosmini College email. Must start with a number and end with @rosmini.school.nz';
    const message = validationResult.error.errors[0]?.message || defaultMsg;
    throw new Error(message);
  }

  // Extract student ID from the local part of the email
  const localPart = cleanEmail.split('@')[0];
  const studentId = `STU-${localPart}`;

  return {
    id: studentId,
    name: name.trim(),
    email: cleanEmail
  };
}
