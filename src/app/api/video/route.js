import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  
  if (!filename) {
    return new Response('Filename parameter is required', { status: 400 });
  }

  try {
    const s3client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
    });

    const response = await s3client.send(command);
    const stream = response.Body;

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Return the video with proper headers
    return new Response(buffer, {
      headers: {
        'Content-Type': response.ContentType || 'video/mp4',
        'Content-Length': response.ContentLength?.toString() || buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching video from S3:', error);
    return new Response('Error fetching video', { status: 500 });
  }
}
