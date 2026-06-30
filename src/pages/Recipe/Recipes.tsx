import { useEffect, useState } from "react";
import { apiConfig } from "../../axios";
import { Link } from "react-router-dom";

export interface RecipesResponse {
  recipes: RecipesInfo[];
  total: number;
  skip: number;
  limit: number;
}

export interface RecipesInfo {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  caloriesPerServing: number;
  servings: number;
  rating: number;
  reviewCount: number;
  userId: number;
  ingredients: string[];
  instructions: string[];
  mealType: string[];
  tags: string[];
}

const Recipes = () => {
  const [recipeDetails, setRecipeDetails] = useState<RecipesResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const getRecipes = async () => {
    try {
      const response = await apiConfig.get<RecipesResponse>("recipes");

      setRecipeDetails(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  if (loading) {
    return <h1 className="text-center mt-10 text-2xl">Loading...</h1>;
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Recipe Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {recipeDetails?.recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 bg-white flex flex-col justify-between hover:scale-105"
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-60 object-cover"
            />

            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {recipe.difficulty}
                </span>

                <span className="text-yellow-500 font-semibold">
                  ⭐ {recipe.rating}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>

              <p className="text-gray-500 mb-3">{recipe.cuisine}</p>

              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>🍽 {recipe.servings} Servings</span>

                <span>
                  ⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/Recipes/${recipe.id}`}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition"
              >
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
