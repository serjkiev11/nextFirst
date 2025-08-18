import bcryptjs from 'bcryptjs'

export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcryptjs.hash(password, saltRounds)
}

export async function comparePasswords(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(plaintext, hash)
}
