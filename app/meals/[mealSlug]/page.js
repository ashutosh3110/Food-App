import Image from "next/image"
import classes from "./page.module.css"
import {getMeal} from "@/lib/meals"
import { notFound } from "next/navigation";

export default async function MealSlugPage({params}){
    const {mealSlug}=await params;
    const meal=  getMeal(mealSlug);

    if(!meal){
        notFound();
    }
    meal.instructions=meal.instructions.replace(/\n/g,'<br />')
    return (
        
        <>
        <header className={classes.header} >
            <div className={classes.image}>
                <Image 
                  src={`https://ashutosh-nextjs-demo-users-image.s3.ap-south-1.amazonaws.com/${meal.image}`}
                alt={meal.title} 
                fill  
                sizes="(max-width: 768px) 100vw, 
                      (max-width: 1200px) 50vw, 
                        33vw"/>
            </div>
            <div className={classes.headerText}>
                <h1>{meal.title}</h1>
                <p className={classes.creator}>
                    by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
                </p>
                <p className={classes.summary}>{meal.summary}</p>

            </div>
        </header>
        <main>
            <p className={classes.instructions} dangerouslySetInnerHTML={{__html:meal.instructions}}></p>
        </main>
        </>
    )
}