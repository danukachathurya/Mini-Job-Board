import { db } from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return Response.json({ error: "Invalid job ID format" }, { status: 400 });
    }

    const jobId = Number(id);
    const existingJob = await db.job.findUnique({ where: { id: jobId } });

    if (!existingJob) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    await db.job.delete({ where: { id: jobId } });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return Response.json(
      {
        error: "Failed to delete job",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
