import { createClient } from '@supabase/supabase-js';
import slugify from "slugify";
import { S3 } from '@aws-sdk/client-s3'; // ✅ Correct import

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ Initialize S3 client
const s3 = new S3({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Get meals
export async function getMeals() {
  const { data, error } = await supabase.from('meals').select('*');
  if (error) throw error;
  return data;
}

// ✅ Get meal by slug
export async function getMeal(slug) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

// ✅ Save new meal
export async function saveMeal(meal) {
  if (!meal.title) throw new Error("Meal title is required");

  // Slugify first
  meal.slug = slugify(meal.title, { lower: true });

  // Upload to S3
  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  await s3.putObject({
    Bucket: 'ashutosh-nextjs-demo-users-image',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
    ACL: 'public-read',
  });

  // Save only fileName in DB
  meal.image = fileName;

  // Insert into Supabase
  const { data, error } = await supabase.from('meals').insert([meal]);
  if (error) throw error;

  return data;
}
