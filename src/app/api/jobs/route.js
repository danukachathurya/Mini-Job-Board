import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received data:', body);

    const { title, company, location, jobType, description, email } = body;

    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!company) missingFields.push('company');
    if (!location) missingFields.push('location');
    if (!jobType) missingFields.push('jobType');
    if (!description) missingFields.push('description');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        missingFields
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const job = await db.job.create({
      data: { title, company, location, jobType, description, postedBy: email }
    });

    return new Response(JSON.stringify(job), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Job creation error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request) {
  try {
    await db.$connect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const jobs = await db.$transaction(async (tx) => {
      return await tx.job.findMany({
        where: { postedBy: email },
        orderBy: { createdAt: 'desc' }
      });
    });

    return new Response(
      JSON.stringify(jobs),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store' 
        } 
      }
    );
    
  } catch (error) {
    console.error('JOB FETCH ERROR:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      potentialCauses: [
        'Database connection failed',
        'Table does not exist',
        'Invalid email format'
      ]
    });

    return new Response(
      JSON.stringify({ 
        error: 'Failed to load jobs',
        details: process.env.NODE_ENV === 'development' 
          ? error.message 
          : undefined
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } finally {
    await db.$disconnect();
  }
}