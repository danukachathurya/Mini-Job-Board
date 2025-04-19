import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;
    const type = searchParams.get("type");

    const filter = {};
    if (type) {
      filter.jobType = { equals: type.trim(), mode: "insensitive" };
    }

    const totalJobs = await db.job.count({ where: filter });
    const jobs = await db.job.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPages = Math.ceil(totalJobs / limit);

    return Response.json({ jobs, totalPages });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return Response.json(
      { error: "Something went wrong while fetching jobs." },
      { status: 500 }
    );
  }
}
