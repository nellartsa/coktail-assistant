import { useRef, useState } from "react";
import axios from "axios";

import Toaster from "./Toaster";
import SearchBar from "./components/SearchBar";
import { DrinkCard } from "./components/Card";
import { useNotification } from "./NotificationContext";

import { trashIcon } from "./assets/icons";
import loader from "./assets/loader.gif";
import "./App.css";

function App() {
  const initialState = {
    isLoading: false,
    drinks: [],
    msg: "",
  };
  const [cocktails, setCocktails] = useState(initialState);
  const [cart, setCart] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const timeoutRefs = useRef({});
  const { addNotification } = useNotification();

  const handleSearch = async (search) => {
    setCocktails({ ...initialState, isLoading: true });

    try {
      const { data } = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`
      );

      if (data.drinks.length) {
        setCocktails({
          ...cocktails,
          isLoading: false,
          drinks: data.drinks,
        });
      } else {
        setCocktails({
          ...cocktails,
          isLoading: false,
          msg: "No Drinks Found.",
        });
      }
    } catch (err) {
      setCocktails({ ...cocktails, isLoading: false, msg: err });
    }
  };

  const handleAddtoCart = (ingredients) => {
    ingredients.forEach((ingredient) => {
      const doesExist = cart.includes(ingredient.item);

      if (doesExist) {
        addNotification({
          message: `Ingredient ${ingredient.item} already added!`,
          type: "warning",
        });

        setHighlights((prev) => {
          const updatedHighlight = prev.filter(
            (item) => item !== ingredient.item
          );

          updatedHighlight.push(ingredient.item);

          if (timeoutRefs.current[ingredient.item]) {
            clearTimeout(timeoutRefs.current[ingredient.item]);
          }
          timeoutRefs.current[ingredient.item] = setTimeout(() => {
            setHighlights((prev) =>
              prev.filter((item) => item !== ingredient.item)
            );
            delete timeoutRefs.current[ingredient.item];
          }, 1000);

          return updatedHighlight;
        });
      } else {
        addNotification({
          message: `Ingredient ${ingredient.item} added!`,
          type: "success",
        });
        setCart((prev) => [...prev, ingredient.item]);
      }
    });
  };

  const handleRemovefromCart = (item, id) => {
    addNotification({
      message: `Ingredient ${item} removed!`,
      type: "danger",
    });

    setCart((prev) => {
      return prev.filter((_, index) => index !== id);
    });
  };

  const printIngredients = () => {
    let newTab = window.open("", "_blank");

    if (newTab) {
      const cartItemsHtml = cart
        .map(
          (item, index) =>
            `<div key="${index}" class="ingredient">${item}</div>`
        )
        .join("");

      var htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ingredient</title>
          <style>
            .container{
              display: flex;
              justify-content: center;
            }
            .ingredients {
              display: flex;
              flex-direction: column;
              border: 1px solid #c8c8c8;
              border-radius: 10px;
              padding: 10px 20px;
              min-width: 200px;
              max-width: 500px
            }
            .ingredient {
              position: relative;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .print-button {
              margin: 20px 0;
              padding: 10px 20px;
              cursor: pointer;
              background-color: #fd5732;
              color: #ffb787;
              border: none;
              border-radius: 10px;
            }
            @media print {
              .print-button {
                  display: none;
              }
              @page {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="ingredients">
              <h1>Ingredients</h1>
              ${cartItemsHtml}
              <button class="print-button" onclick="window.print()">Print Ingredients</button>
            </div>
          </div>
            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
      `;

      newTab.document.open();
      newTab.document.write(htmlContent);
      newTab.document.close();
    } else {
      alert(
        "The new tab could not be opened. Please check your browser settings."
      );
    }
  };

  return (
    <>
      <Toaster />
      <section className="container flex flex-column">
        <SearchBar onSearch={handleSearch} />

        <div className="content">
          <div className="results relative">
            <div className="loader absolute">
              {cocktails.isLoading && (
                <>
                  <img src={loader} />
                  <span className="absolute">loading</span>
                </>
              )}
            </div>
            {cocktails.msg.length > 0 && (
              <div className="absolute">{cocktails.msg}</div>
            )}
            <DrinkCard
              cocktails={cocktails.drinks}
              handleAddtoCart={handleAddtoCart}
            />
          </div>

          <div className="cart relative flex flex-column">
            <h1>Cart</h1>
            <div className="items-con flex flex-wrap flex-column">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className={`card flex ${
                    highlights.includes(item) ? "highlight" : ""
                  }`}
                >
                  <div>{item}</div>
                  <button onClick={() => handleRemovefromCart(item, index)}>
                    {trashIcon}
                  </button>
                </div>
              ))}
            </div>

            <button className="print-btn" onClick={printIngredients}>
              Print
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
