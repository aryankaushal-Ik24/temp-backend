const mongoose = require('mongoose');
const Product = require('../models/Product');
const { default: axios } = require('axios');


const addSelectedSceneWithProduct = async(req,res)=>{
    try {
        const {orgId,directoryId,sceneId,shopifyProductId,handleName,options} = req.body;
        if(!orgId ||!directoryId || !sceneId | !shopifyProductId || !handleName || !options ) return res.status(400).json({
            success:false,
            message:"missing fields"
        })
        const checkExisting = await Product.findOne({shopifyProductId:shopifyProductId});
        if(checkExisting) return res.status(400).json({
            success:false,
            message:"product already added kindly just map the variations"
        })
        const addProduct = new Product({
            orgId: orgId,
            directoryId: directoryId,
            sceneId: sceneId,
            shopifyProductId: shopifyProductId,
            handleName: handleName,
            options:options
        });
        await addProduct.save();
        if(!addProduct) return res.status(400).json({
             success:false,
            message:"some error occured kindly try again"
        })
        return res.status(200).json({
            success:true,
            message:"product added"
        })
    } catch (error) {
        
    }
}

const getProductInformation = async(req,res)=>{
    try {
        const {shopifyId} = req.query;
        if(!shopifyId) return res.status(400).json({
            success:false,
            message:"product id not found"
        });
        const findProduct = await Product.findOne({shopifyProductId:shopifyId});
        if(!findProduct) return res.status(400).json({
            success:false,
            message:"product not found"
        })
        return res.status(200).json({
            success:true,
            message:"product found successfully",
            data:findProduct
        })
    } catch (error) {
        console.log("error occured while finding product");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const updateOptions = async (req,res)=>{
    try {
        const {id,options} = req.body;
        if(!id || !options) return res.status(400).json({
            success:false,
            message:"missing data"
        })
        const updateProduct = await Product.findOneAndUpdate({shopifyProductId:id},{$set:{options:options}},{new:true});
        if(!updateProduct) return res.status(400).json({
            success:false,
            message:"product not found"
        })
        return res.status(200).json({
            success:true,
            message:"product updated successfully",
        })
        
    } catch (error) {
        console.log("error occured while updating product");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteProductMapping = async(req,res)=>{
    try {
        const {shopifyId} = req.query;
        if(!shopifyId) return res.status(400).json({
            success:false,
            message:"product id not found"
        });
        const deleteProduct = await Product.findOneAndDelete({shopifyProductId:shopifyId});
        if(!deleteProduct) return res.status(400).json({
            success:false,
            message:"product not found"
        })
        return res.status(200).json({
            success:true,
            message:"product deleted successfully",
        })
    } catch (error) {
        console.log("error occured while deleting product");
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


const getAllProducts = async (req, res) => {
  try {
    const shop = req.query.shop;
    const authHeader = req.headers.authorization;

    // Extract Bearer token
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    console.log("access token:", accessToken);

    if (!shop || !accessToken) {
      return res.status(400).json({ message: 'Missing shop in query or access token in headers' });
    }

    const url = `https://${shop}/admin/api/2024-01/products.json`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json({
      message: 'Fetched products successfully',
      products: response.data?.products || [],
    });
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

const updateProducts = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const { shopUrl, products } = req.body; // Expecting an array of product objects

    if (!shopUrl || !accessToken || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Missing shop, token, or products array' });
    }

    const results = [];

    for (const product of products) {
      try {
        let response;

        if (!product.id) {
          // Create new product (POST)
          response = await axios.post(
            `https://${shopUrl}/admin/api/2024-01/products.json`,
            { product },
            {
              headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
              },
            }
          );

          results.push({ status: 'success', product: response.data.product });

        } else {
          // Update existing product (PUT)
          response = await axios.put(
            `https://${shopUrl}/admin/api/2024-01/products/${product.id}.json`,
            { product: { id: product.id, ...product } },
            {
              headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
              },
            }
          );

          results.push({ status: 'success', product: response.data.product });
        }

      } catch (err) {
        results.push({
          status: 'error',
          error: err.response?.data || err.message,
          product,
        });
      }
    }

    return res.status(200).json({ uploaded: results.length, results });

  } catch (error) {
    console.error('Error in updateProducts:', error.message);
    res.status(500).json({ message: 'Server error during product updates', error: error.message });
  }
};



const getProductsToUploadOnShop = async(req,res)=>{
    try {
    const {products,shopUrl} = req.body; // Expecting array of product objects
    const accessToken = req.headers.authorization?.split(' ')[1];; // Or: req.headers.authorization
    const shop = shopUrl?.includes('.myshopify.com') ? shopUrl : `${shopUrl}.myshopify.com`

    if (!accessToken || !shop) {
      return res.status(401).json({ error: 'Unauthorized: Missing token or shop domain' });
    }

    const results = [];

    // console.log("data coming",shop,accessToken,products);

    // for (const product of products) {
    //   try {
    //     console.log("product data",product);
    //     const response = await axios.post(
    //       `https://${shop}/admin/api/2024-01/products.json`,
    //       { product },
    //       {
    //         headers: {
    //           'X-Shopify-Access-Token': accessToken,
    //           'Content-Type': 'application/json',
    //         },
    //       }
    //     );
    //     results.push({
    //       status: 'success',
    //       product: response.data.product,
    //     });
    //   } catch (err) {
    //     results.push({
    //       status: 'error',
    //       message: err?.response?.data?.errors || err.message,
    //       input: product.title || '[no-title]',
    //     });
    //   }
    // }

    for (const inputProduct of products) {
      try {
        const mutation = `
          mutation productCreate($input: ProductInput!) {
            productCreate(input: $input) {
              product {
                id
                title
                handle
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const variants = inputProduct.variants.map(variant => ({
          option1: variant.option1,
          price: variant.price,
          compareAtPrice: variant.compare_at_price,
          sku: variant.sku,
          inventoryManagement: variant.inventory_management?.toUpperCase(),
          inventoryPolicy: variant.inventory_policy?.toUpperCase(),
          fulfillmentService: variant.fulfillment_service,
          requiresShipping: variant.requires_shipping,
          taxable: variant.taxable,
          weight: parseFloat(variant.weight),
          weightUnit: variant.weight_unit?.toUpperCase(),
        }));

        const input = {
          title: inputProduct.title,
          bodyHtml: inputProduct.body_html,
          vendor: inputProduct.vendor,
          productType: inputProduct.product_type,
          tags: inputProduct.tags,
          handle: inputProduct.handle,
          published: inputProduct.published,
          options: inputProduct.options.map(opt => ({
            name: opt.name,
            values: opt.values,
          })),
          variants,
          images: [], // Add if needed
        };

        const response = await axios.post(
          `https://${shop}/admin/api/2024-01/graphql.json`,
          {
            query: mutation,
            variables: { input },
          },
          {
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json',
            },
          }
        );

        const gql = response.data;

        if (gql.errors && gql.errors.length > 0) {
          results.push({
            status: "error",
            message: gql.errors.map(e => e.message).join(", "),
            input: inputProduct.title || "[no-title]",
          });
          continue;
        }

        const { productCreate } = gql.data;

        if (!productCreate) {
          results.push({
            status: "error",
            message: "Missing 'productCreate' in response",
            input: inputProduct.title || "[no-title]",
          });
          continue;
        }

        if (productCreate.userErrors.length > 0) {
          results.push({
            status: "error",
            message: productCreate.userErrors.map(e => e.message).join(", "),
            input: inputProduct.title || "[no-title]",
          });
        } else {
          results.push({
            status: "success",
            product: productCreate.product,
          });
        }
      } catch (err) {
        results.push({
          status: "error",
          message: err?.response?.data?.errors || err.message,
          input: product.title || "[no-title]",
        });
      }
    }


    res.status(200).json({ uploaded: results.length, results });

  } catch (error) {
    console.error('❌ Upload Failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {addSelectedSceneWithProduct,getProductInformation, updateOptions,deleteProductMapping,getProductsToUploadOnShop,getAllProducts,updateProducts}



