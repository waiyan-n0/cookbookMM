import RecipeCircle from './RecipeCircle';

import DrinkImage from './../assets/recipes_img/drink.jpg';
import FoodImage from './../assets/recipes_img/drink.jpg';
import DessertImage from './../assets/recipes_img/drink.jpg';
import BakingImage from './../assets/recipes_img/drink.jpg';
import SaladImage from './../assets/recipes_img/drink.jpg';

const RecipesBanner = () => {
    const recipeCategories = [
        { id: 1, title: 'Drinks', image: DrinkImage, link: '/recipes/drinks' },
        { id: 2, title: 'Main Course', image: FoodImage, link: '/recipes/mains' },
        { id: 3, title: 'Desserts', image: DessertImage, link: '/recipes/desserts' },
        { id: 4, title: 'Baking', image: BakingImage, link: '/recipes/baking' },
        { id: 5, title: 'Salads', image: SaladImage, link: '/recipes/salads' },
    ];

    return (
        <div className="overflow-x-hidden w-full bg-gray-50 py-4 relative">
            <div className="flex gap-8 items-center">
                <div className="flex gap-8 shrink-0">
                    {recipeCategories.map((category) => (
                        <RecipeCircle
                            key={`set1-${category.id}`}
                            title={category.title}
                            image={category.image}
                            link={category.link}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecipesBanner;