import { Timer, ChevronRight, ShoppingCart, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { RecipesInfo } from "./Recipes.tsx";
import { apiConfig } from "../../axios";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState<RecipesInfo | null>(null);

  const getRecipes = async () => {
    try {
      const response = await apiConfig.get<RecipesInfo>(`recipes/${id}`);

      setRecipeDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-[#fff8f5] font-['EB_Garamond',serif] text-[#2d2826]">
      <main className="max-w-7xl mx-auto px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Image and Instructions */}
          <div className="lg:w-7/12">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 group">
              <img
                src={`${recipeDetails?.image}`}
                alt="Classic Margherita Pizza"
                className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 flex space-x-3">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-orange-700 uppercase tracking-wider">
                  {recipeDetails?.cuisine}
                </span>
              </div>
              <a
                target="_blank"
                href={`https://www.youtube.com/results?search_query=${recipeDetails?.name}`}
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#c43a2f] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Play fill="currentColor" className="ml-1" />
              </a>
            </div>

            <h1 className="text-6xl font-bold mb-6 text-[#1a1614]">
              {recipeDetails?.name}
            </h1>
            <div className="grid grid-cols-3 gap-1 border-y border-[#e1d8d4] py-8 mb-12">
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-widest text-[#8c827d] mb-1">
                  Prep Time
                </span>
                <span className="text-2xl font-bold text-[#c43a2f]">
                  {recipeDetails?.prepTimeMinutes}m
                </span>
              </div>
              <div className="text-center border-x border-[#e1d8d4]">
                <span className="block text-[10px] uppercase tracking-widest text-[#8c827d] mb-1">
                  Cook Time
                </span>
                <span className="text-2xl font-bold text-[#c43a2f]">
                  {recipeDetails?.cookTimeMinutes}m
                </span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-widest text-[#8c827d] mb-1">
                  Difficulty
                </span>
                <span className="text-2xl font-bold text-[#c43a2f]">
                  {recipeDetails?.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-12">
              <h2 className="text-3xl font-bold border-l-4 border-[#c43a2f] pl-6">
                Preparation
              </h2>
              <div className="space-y-8">
                {recipeDetails?.instructions.map((recipeDetails, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="shrink-0 w-10 h-10 rounded-full border border-[#c43a2f] text-[#c43a2f] flex items-center justify-center font-bold text-sm ">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-[#5c5450] leading-relaxed">
                        {recipeDetails}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Ingredients and Sidebar */}
          <div className="lg:w-5/12 space-y-12">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#e1d8d4]">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold">Ingredients</h2>
              </div>

              <ul className="space-y-4 mb-10">
                {recipeDetails?.ingredients.map((item, index) => (
                  <li key={index} className="flex items-center group gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className="appearance-none w-5 h-5 border border-red-300 rounded checked:border-red-300   checked:bg-[#c43a2f] focus:ring-2 focus:ring-gray-100 focus:outline-none "
                    />
                    {/* <div className="w-5 h-5 border-2 border-[#e1d8d4] rounded mr-4 group-hover:border-[#c43a2f] transition-colors" /> */}
                    <span className="text-[#5c5450] group-hover:text-[#1a1614] transition-colors ">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-[#c43a2f] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:bg-[#a2211a] transition-all shadow-md active:scale-[0.98]">
                <ShoppingCart size={22} />
                <span>Add All to Shopping List</span>
              </button>

              <div className="mt-10 pt-10 border-t border-[#e1d8d4] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Timer size={24} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[#8c827d]">
                      Kitchen Timer
                    </span>
                    <span className="font-bold">Set for Baking State</span>
                  </div>
                </div>
                <button className="text-[#c43a2f] hover:scale-110 transition-transform">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetails;
