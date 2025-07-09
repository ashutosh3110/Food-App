import MealItem from "./meal-items"
import classes from "./meals-grid.module.css"

export default function MealsGrid({meals}){
    return(
        <ul className={classes.meals}>
            {meals.map((meal)=>{
                return(
                <li key={meal.id}>
                    <MealItem {...meal} />
                </li>
                )
            })}
        </ul>
    )
}