export type SessionLike = { sub?: string } | null | undefined
export type CartKey = { userId?: string; cartId?: string }

export const resolveCartKey = (session: SessionLike, gid?: string): CartKey => {
  const userId = session?.sub
  if (userId) return { userId }
  if (gid && gid.trim()) return { cartId: gid }
  return {}
}
