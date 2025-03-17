import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import debounce from "lodash.debounce";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStock, setFilterStock] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  //  Handle Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, sortOrder, filterStock, currentPage]);

  //  Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products");
      const data = await response.json();
      let filteredProducts = data.products || [];
      // Search Filter
      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Stock Availability Filter
      if (filterStock === "in-stock") {
        filteredProducts = filteredProducts.filter((product) => product.stock > 0);
      } else if (filterStock === "out-of-stock") {
        filteredProducts = filteredProducts.filter((product) => product.stock === 0);
      }

      // Sorting
    filteredProducts.sort((a, b) => {
        const priceA = a.variants?.[0]?.price || 0; 
        const priceB = b.variants?.[0]?.price || 0;
    
        if (sortOrder === "asc") {
        return priceA - priceB;
        } else {
        return priceB - priceA;
        }
    });

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  // ✅ Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  //  Formik setup for adding & editing products
  const formik = useFormik({
    initialValues: {
      title: editingProduct ? editingProduct.title : "Product Name",
      price: editingProduct ? editingProduct.price : "1",
      imgSrc: editingProduct ? editingProduct.imgSrc : "https://boltagency.ca/content/images/2020/03/placeholder-images-product-1_large.png",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be a positive number"),
      imgSrc: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
      } else {
        await createProduct(values);
      }
      resetForm();
    },
  });

  //  Create Product
  const createProduct = async (product) => {
    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      setProducts([...products, data.product]);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  //  Update Product
  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();
      setProducts(products.map((p) => (p.id === id ? data.product : p)));
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  //  Delete Single Product
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  //  Bulk Delete Products
  const bulkDeleteProducts = async () => {
    try {
      await Promise.all(selectedProducts.map((id) => deleteProduct(id)));
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error in bulk deletion:", error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Shopify Dashboard</h1>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="px-3 py-2 border dark:border-gray-600 rounded-lg"
            onChange={(e) => debouncedSearch(e.target.value)}
          />

          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border dark:border-gray-600 rounded-lg"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          <select
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-3 py-2 border dark:border-gray-600 rounded-lg"
          >
            <option value="all">All Products</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded-md"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="mb-4 p-4 border dark:border-gray-700 rounded-lg shadow">
        <h2 className="text-lg font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formik.values.title}
          className="border dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-800 dark:text-white"
          {...formik.getFieldProps("title")}
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500">{formik.errors.title}</div>
        )}

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formik.values.price}
          className="border dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-800 dark:text-white"
          {...formik.getFieldProps("price")}
        />
        {formik.touched.price && formik.errors.price && (
          <div className="text-red-500">{formik.errors.price}</div>
        )}

        <input
          type="text"
          name="imgSrc"
          placeholder="Source link to image"
          value={formik.values.imgSrc}
          className="border dark:border-gray-600 p-2 w-full rounded mt-2 bg-white dark:bg-gray-800 dark:text-white"
          {...formik.getFieldProps("imgSrc")}
        />
        {formik.touched.imgSrc && formik.errors.imgSrc && (
          <div className="text-red-500">{formik.errors.imgSrc}</div>
        )}

        <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Bulk Delete Button */}
      {selectedProducts.length > 0 && (
        <button onClick={bulkDeleteProducts} className="mb-4 px-4 py-2 bg-red-500 text-white rounded-md">
          Delete Selected ({selectedProducts.length})
        </button>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="border dark:border-gray-700 p-4 rounded-lg shadow" style={{position: "relative"}}>
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedProducts((prev) =>
                    e.target.checked ? [...prev, product.id] : prev.filter((id) => id !== product.id)
                  )
                }
                style={{position: "absolute", top: "25px", left: "25px", border: "2px solid black"}}
              />
              <img
                src={product.image?.src || "https://boltagency.ca/content/images/2020/03/placeholder-images-product-1_large.png"}
                alt={product.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">${product.variants?.[0]?.price}</p>

              <button
                onClick={() => setEditingProduct(product)}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="mt-2 px-4 py-1 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-400 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          disabled={indexOfLastProduct >= products.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-400 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;