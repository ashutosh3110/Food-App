import fs from "node:fs"

import { S3 } from '@aws-sdk/client-s3';
import sql from "better-sqlite3"
const s3 = new S3({
   region: 'ap-south-1'
  });
const db=sql('meals.db');
import slugify from "slugify";
import xss from "xss"
import { error } from "node:console";



export async function getMeals(){
    await new Promise((resolve)=>setTimeout(resolve,1000));
    // throw new error("error occured");
    
     return db.prepare("SELECT * FROM meals").all()
}

export  function getMeal(slug){
    return db.prepare("SELECT * FROM meals WHERE slug=?").get(slug);
}

export async function saveMeal(meal){
    meal.slug=slugify(meal.title,{lower:true});
    meal.instructions=xss(meal.instructions);

    const extension=meal.image.name.split('.').pop();
    const fileName=`${meal.slug}.${extension}`;

  
    const bufferedImage=await meal.image.arrayBuffer();

     
  s3.putObject({
    Bucket: 'ashutosh-nextjs-demo-users-image',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
    ACL: 'public-read',
    
  });

    meal.image=fileName;

    db.prepare(`
        INSERT INTO meals 
         (title,summary,instructions,creator,creator_email,image,slug)
         VALUES(
         @title,
         @summary,
         @instructions,
         @creator,
         @creator_email,
         @image,
         @slug
         )
        `).run(meal);

}
