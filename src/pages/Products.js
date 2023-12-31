import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import "./Products.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faShoppingCart,
  faInfoCircle,
  faHome,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FiLogOut } from "react-icons/fi"; // Add this import

function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_picture: "",
    price: "",
    brand: "",
    description: "",
    colors: "",
    in_stock: "",
    weight: "",
  });
  const [userType, setUserType] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const userId = JSON.parse(localStorage.getItem("username")).id;

  const fetchProductsFromServer = async () => {
    try {
      const response = await fetch(`http://localhost:3001/products`);
      const data = await response.json();
      setProducts(Array.from(data));
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching products");
    }
  };

  const fetchCartProductsFromServer = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/MyCart`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        // Make sure data is an array, and then set the addedProducts state
        setAddedProducts(data);
      } else {
        console.error("Invalid data format for cart products:", data);
        setAddedProducts([]); // Reset to empty array to handle the error case
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching cart items");
    }
  };

  useEffect(() => {
    fetchProductsFromServer();
    fetchCartProductsFromServer();
    const user = JSON.parse(localStorage.getItem("username"));
    if (user && user.usertype) {
      setUserType(user.usertype);
    }
  }, []);

  const handleAddToCart = async (productId) => {
    if (!productId) {
      alert("Invalid product ID");
      return;
    }

    try {
      await fetch(`http://localhost:3001/users/${userId}/MyCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      alert("Product added to your cart successfully");
      fetchCartProductsFromServer(); // Update cart items after adding a product
    } catch (error) {
      console.error(error);
      alert("Error adding the product to the cart: " + error.message);
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const colorsArray = newProduct.colors
      .split(",")
      .map((color) => color.trim());
    newProduct.colors = colorsArray;

    for (const key in newProduct) {
      if (newProduct.hasOwnProperty(key) && newProduct[key] === "") {
        alert("Please fill in all the required fields");
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const addedProductData = await response.json();
        alert("Product added successfully");

        setAddedProducts((prevAddedProducts) => [...prevAddedProducts, addedProductData]);

        setNewProduct({
          product_name: "",
          product_picture: "",
          price: "",
          brand: "",
          description: "",
          colors: "",
          in_stock: "",
          weight: "",
        });
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Product deleted successfully");
        fetchProductsFromServer();
        setAddedProducts((prevAddedProducts) =>
          prevAddedProducts.filter(
            (product) => product.product_id !== productId
          )
        );
      }
      // else {
      //   alert("Failed to delete product");
      // }
      // }
      else {
        alert("Cannot delete the product as it is referenced in the cart.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the product");
    }
  };

  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };


  return (
    <div className="product">
      <h2>
        <FontAwesomeIcon icon={faShoppingCart} /> My Cart
      </h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-item">
            <h3>{product.product_name}</h3>
            {console.log("Product Picture URL:", product.product_picture)}{" "}
            <Link to={`/products/${product.product_id}`}>
            
              <img
                className="product-image"
                src={product.product_picture}
                alt={product.product_name}
                onClick={() => handleProductClick(product.product_id)} // Add onClick event here
              />
            </Link>

            <h3>{product.price + "$"}</h3>
            <div className="button-container">
              <button onClick={() => handleAddToCart(product.product_id)}>
                Add to My Cart
              </button>
              {userType === "admin" && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product.product_id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {addedProducts.map((product) => (
          <div key={product.product_id} className="product-item">
            <h3>{product.product_name}</h3>
            <img
              className="product-image"
              src={product.product_picture}
              alt={product.product_name}
            />
            <h3>{product.price + "$"}</h3>
            <button onClick={() => handleAddToCart(product.product_id)}>
              Add to My Cart
            </button>
            {userType === "admin" && (
              <button onClick={() => handleDeleteProduct(product.product_id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      {userType === "admin" && (
        <div className="add-product-form">
          <h3>Add a New Product</h3>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.product_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, product_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Product Picture URL"
              value={newProduct.product_picture}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  product_picture: e.target.value,
                })
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              min="0"
              required
            />
            <input
              type="text"
              placeholder="Brand"
              value={newProduct.brand}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Colors"
              value={newProduct.colors}
              onChange={(e) =>
                setNewProduct({ ...newProduct, colors: e.target.value })
              }
              required
            />
            <label>
              In Stock:
              <input
                type="checkbox"
                checked={newProduct.in_stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, in_stock: e.target.checked })
                }
                required
              />
            </label>
            <input
              type="number"
              placeholder="Weight"
              value={newProduct.weight}
              onChange={(e) =>
                setNewProduct({ ...newProduct, weight: e.target.value })
              }
              min="0"
              required
            />
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Products;
