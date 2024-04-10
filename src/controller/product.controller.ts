import { Request, Response } from "express";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  findAndUpdateProduct,
  findProduct,
  getAllAdminProducts,
  getAllProducts,
} from "../service/product.service";
import log from "../utils/logger";

// Create Product
export async function createProductHandler(
  req: Request<object, object, CreateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const body = req.body;

  try {
    await createProduct({ ...body, user: userId });

    return res.sendStatus(200);
  } catch (e) {
    log.error("[CREATEPRODUCT]:: " + e);
    return res.status(500).json({ message: "Internal error" });
  }
}

// Update Product
export async function updateProductHandler(
  req: Request<UpdateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  const update = req.body;

  try {
    const product = await findProduct({ _id: productId });

    if (!product) {
      return res.sendStatus(404);
    }

    if (String(product.user) !== userId) {
      return res.sendStatus(403);
    }

    await findAndUpdateProduct({ _id: productId }, update, { new: true });

    return res.sendStatus(200);
  } catch (e) {
    log.error("[UPDATEDPRODUCT]:: " + e);
    return res.status(500).json({ message: "Internal error" });
  }
}

// Get Product By Id
export async function getProductHandler(
  req: Request<GetProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;

  try {
    const product = await findProduct({ _id: productId });

    if (!product) {
      return res.sendStatus(404);
    }

    return res.status(200).json(product);
  } catch (e) {
    log.error("[GETPRODUCT]:: " + e);
    return res.status(500).json({ message: "Internal error" });
  }
}

// Get All Products
export async function getAllProductHandler(req: Request, res: Response) {
  try {
    const products = await getAllProducts({});

    if (!products || products.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).json({ products });
  } catch (e) {
    log.error("[GETPRODUCT]:: " + e);
    return res.status(500).json({ message: "Internal error" });
  }
}
export async function getAllAdminProductHandler(req: Request, res: Response) {
  try {
    const products = await getAllAdminProducts({});

    if (!products || products.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).json({ products });
  } catch (e) {
    log.error("[GETAdminPRODUCT]:: " + e);
    return res.status(500).json({ message: "Internal error" });
  }
}

// Delete Product
export async function deleteProductHandler(
  req: Request<DeleteProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  try {
    const product = await findProduct({ _id: productId });

    if (!product) {
      return res.sendStatus(404);
    }

    if (String(product.user) !== userId) {
      return res.sendStatus(403);
    }

    await findAndUpdateProduct(
      { _id: productId },
      { isArchived: true },
      { new: true }
    );

    return res.json({ message: "Product remove successfully!" });
  } catch (e) {
    log.error("[DELETEPRODUCT]:: " + e);
    return res.status(500).json({ message: "Internal error" });
  }
}
