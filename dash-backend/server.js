require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;
const SHOPIFY_API_VERSION = "2024-01"; // Update as needed

// Check if required environment variables are set
if (!process.env.SHOPIFY_STORE_URL || !process.env.SHOPIFY_ACCESS_TOKEN) {
  console.error("❌ Missing Shopify environment variables. Please check .env file.");
  process.exit(1);
}

const SHOPIFY_API_URL = `${process.env.SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/products.json`;
const SHOPIFY_HEADERS = {
  "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

// Enable CORS with specific origin (replace * with your frontend URL in production)
app.use(cors({ origin: "*" }));
app.use(express.json());

// **1️⃣ Fetch All Products**
app.get("/api/products", async (req, res) => {
  try {
    const response = await axios.get(SHOPIFY_API_URL, { headers: SHOPIFY_HEADERS });
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// **2️⃣ Create a Product**
app.post("/api/products", async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || !price || isNaN(price)) {
      return res.status(400).json({ error: "Title and a valid price are required" });
    }

    const newProduct = {
      product: {
        title,
        body_html: `<p>${title} - Price: $${price}</p>`,
        vendor: "my-dashboard-dev",
        variants: [{ price: parseFloat(price) }], // Ensure price is a number
      },
    };

    const response = await axios.post(SHOPIFY_API_URL, newProduct, { headers: SHOPIFY_HEADERS });
    res.status(201).json(response.data);
  } catch (error) {
    console.error("❌ Error creating product:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// **3️⃣ Update a Product**
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;

    if (!title || !price || isNaN(price)) {
      return res.status(400).json({ error: "Title and a valid price are required" });
    }

    const updateProductData = {
      product: {
        id,
        title,
        body_html: `<p>${title} - Price: $${price}</p>`,
        variants: [{ price: parseFloat(price) }], // Ensure price is a number
      },
    };

    const response = await axios.put(
      `${process.env.SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/products/${id}.json`,
      updateProductData,
      { headers: SHOPIFY_HEADERS }
    );

    res.json(response.data);
  } catch (error) {
    console.error(`❌ Error updating product ${req.params.id}:`, error.response?.data || error.message);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// **4️⃣ Delete a Product**
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await axios.delete(
      `${process.env.SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/products/${id}.json`,
      { headers: SHOPIFY_HEADERS }
    );

    res.json({ message: `✅ Product ${id} deleted successfully` });
  } catch (error) {
    console.error(`❌ Error deleting product ${req.params.id}:`, error.response?.data || error.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});