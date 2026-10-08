import {
  isWakaTimeConfigured,
  todayTime,
} from "@/lib/wakatime/wakatime-service";

export async function GET() {
  const codeTime = await todayTime();
  return Response.json(
    {
      enabled: isWakaTimeConfigured(),
      codeTime: codeTime
        ? { hours: codeTime.hours, minutes: codeTime.minutes }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
