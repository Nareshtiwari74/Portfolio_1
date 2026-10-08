import {
  databaseConfigured,
  json,
  sameOrigin,
  sessionUser,
} from "@/lib/guestbook/server";

const publicFields = {
  id: true,
  name: true,
  content: true,
  avatar: true,
  date: true,
} as const;

export async function GET() {
  if (!databaseConfigured())
    return json(
      { message: "Guestbook messages are currently unavailable." },
      503,
    );
  try {
    const { prisma } = await import("@/lib/prisma");
    const comments = await prisma.comment.findMany({
      orderBy: [{ date: "desc" }, { id: "desc" }],
      select: publicFields,
      take: 200,
    });
    return json({ comments });
  } catch {
    return json(
      { message: "Guestbook messages are currently unavailable." },
      503,
    );
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ message: "Invalid request origin" }, 403);
  if (!databaseConfigured())
    return json({ message: "Guestbook is currently unavailable." }, 503);
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return json({ message: "Expected a JSON message." }, 415);
  try {
    const user = await sessionUser();
    if (!user)
      return json({ message: "Session expired. Please sign in again." }, 401);
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ message: "Invalid message." }, 400);
    }
    const content =
      typeof body?.content === "string" ? body.content.trim() : "";
    if (!content || content.length > 500)
      return json({ message: "Messages must contain 1–500 characters." }, 400);
    const { prisma } = await import("@/lib/prisma");
    // Lock per author so simultaneous submissions cannot bypass the cooldown.
    const commentDb = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${user.id}))`;
      const previous = await tx.comment.findFirst({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        select: { date: true },
      });
      if (previous && Date.now() - previous.date.getTime() < 20_000)
        return null;
      return tx.comment.create({
        data: {
          userId: user.id,
          name: user.name,
          avatar: user.picture,
          content,
          date: new Date(),
        },
        select: publicFields,
      });
    });
    if (!commentDb)
      return json(
        { message: "Please wait 20 seconds before posting another message." },
        429,
      );
    return json({ commentDb }, 201);
  } catch {
    return json(
      { message: "Unable to save your message. Please try again." },
      503,
    );
  }
}
