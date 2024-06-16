import React from "react";
import { addIcon } from "../assets/icons";

export const DrinkCard = ({ cocktails, handleAddtoCart }) => {
  return (
    <>
      {cocktails.map((drink) => {
        const ingredients = [];
        for (let i = 1; i < 15; i++) {
          if (drink[`strIngredient${i}`]) {
            ingredients.push({
              item: drink[`strIngredient${i}`].replace(/\b\w/g, (match) => {
                return match.toUpperCase();
              }),
              measurement: drink[`strMeasure${i}`],
            });
          }
        }

        const instructions = drink.strInstructions
          .split(".")
          .map((instruction) => instruction.trim())
          .filter((instruction) => instruction.length > 0);

        const cleanUp = {
          id: drink.idDrink,
          title: drink.strDrink,
          category: drink.strCategory,
          alcohol: drink.strAlcoholic,
          image: drink.strDrinkThumb,
        };

        return (
          <div key={cleanUp.id} className="card relative">
            <button
              className="card-add2cart absolute"
              onClick={() => handleAddtoCart(ingredients)}
            >
              {addIcon}&nbsp;Add
            </button>
            <div className="card-banner relative">
              <img src={cleanUp.image} alt={cleanUp.title} />
              <div className="overlay absolute"></div>
              <div className="card-banner-content absolute">
                <h1>{cleanUp.title}</h1>
                <h5>
                  Category: <span>{cleanUp.category}</span>
                </h5>
                <h5>
                  Alcohol: <span>{cleanUp.alcohol}</span>
                </h5>
              </div>
            </div>

            <div className="card-content flex flex-column">
              <div className="ingredients">
                <h4>Ingredient</h4>
                {ingredients.map((ingredient, index) => (
                  <div className="flex" key={index}>
                    <div>&bull; {ingredient.item}</div>
                    <div className="ml-auto fs-10px">
                      {ingredient.measurement || "N/A"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="instructions">
                <h4>Instruction</h4>
                {instructions.map((instruction, index) => (
                  <p key={index} className="flex">
                    <span>{index + 1}.</span> {instruction}.
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
