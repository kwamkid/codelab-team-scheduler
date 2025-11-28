import { cookies } from "next/headers";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    return false;
  }

  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!sessionSecret) {
    return false;
  }

  try {
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    const [secret, timestamp] = decoded.split(":");

    // Check if secret matches
    if (secret !== sessionSecret) {
      return false;
    }

    // Check if session is not older than 1 day
    const sessionAge = Date.now() - parseInt(timestamp, 10);
    const maxAge = 60 * 60 * 24 * 1000; // 1 day in milliseconds

    return sessionAge < maxAge;
  } catch {
    return false;
  }
}
