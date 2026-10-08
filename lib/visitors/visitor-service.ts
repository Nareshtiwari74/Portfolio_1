import { randomUUID } from "crypto";

import { integrationConfig } from "@/lib/site";

export const generateUniqueId = (): string => {
  return randomUUID();
};

export const isVisitorCounterConfigured = () =>
  (process.env.VISITOR_COUNT_ENABLED === "true" ||
    integrationConfig.activityEnabled) &&
  Boolean(process.env.DATABASE_URL?.trim());

export const visitorCounter = async (uniqueId: string) => {
  if (!isVisitorCounterConfigured()) {
    return { count: null, message: "Visitor count unavailable" };
  }

  const { prisma } = await import("@/lib/prisma");
  if (uniqueId === "noid") {
    const newUniqueId = generateUniqueId();

    // Register the browser and increment the total together so a failed
    // database write cannot leave a visitor that was never counted.
    const [, updated] = await prisma.$transaction([
      prisma.visitorIp.create({
        data: {
          ip: newUniqueId,
          date: new Date(),
        },
      }),
      prisma.totalCount.upsert({
        where: {
          id: 1,
        },
        create: {
          id: 1,
          totalVisitors: 1,
          LastUpdate: new Date(),
        },
        update: {
          totalVisitors: {
            increment: 1,
          },
          LastUpdate: new Date(),
        },
      }),
    ]);

    return {
      count: updated.totalVisitors,
      visitorId: newUniqueId,
      message: "Successfully added new visitorId",
    };
  }

  const alreadyIp = await prisma.visitorIp.findFirst({
    where: {
      ip: uniqueId,
    },
  });

  if (alreadyIp) {
    const totalCount = await prisma.totalCount.findUnique({
      where: {
        id: 1,
      },
      select: {
        totalVisitors: true,
      },
    });

    return {
      found: true,
      count: totalCount?.totalVisitors ?? null,
      message: "visitorId already exists",
    };
  }

  return {
    found: false,
    count: null,
    message: "ID not found please send a valid visitorId",
    clearId: true,
  };
};
