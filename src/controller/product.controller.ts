import { Request, Response } from "express";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  findAdminProduct,
  findAndUpdateProduct,
  findProduct,
  findProductByCatgory,
  getAllAdminProducts,
  getAllProducts,
} from "../service/product.service";
import log from "../utils/logger";
import { GetProductByCategoryInput } from "../schema/category.schema";
import { getPersonalSurvey } from "../service/survey.service";
import { ProductDocument } from "../models/product.model";
import { shuffleArray } from "../utils/shiffleArray";

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
    const product = await findAdminProduct({ _id: productId });

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
    log.error("[GETALLPRODUCT]:: " + e);
    return res.status(500).json({ message: "Internal error" });
  }
}
export async function getProductByCategoryHandler(req: Request<GetProductByCategoryInput["params"]>, res: Response) {

  const categoryId = req.params.categoryId;
  try {
    const products = await findProductByCatgory({category:categoryId});

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

// get product based on recommandation.

export async function  getRecommandedProductHandler(req: Request, res:Response){
  const userId = res.locals.user._id;

  try{

    const survey = await getPersonalSurvey({user:userId},{new:true});

    if(!survey){
      return res.sendStatus(404);
    }

    const allProduct = await getAllProducts();

    if(allProduct.length===0){
      return  res.status(404).json({message:"No Product in the database."})
    }

    let selectProduct:ProductDocument[] =[] ;

    allProduct.forEach(product=>{
      const subCategories = product.subCategories;

      const problems = survey.problemCategories.join(" ").split(" ");


      for(const subCat  of subCategories ){
        for(const problem of problems){
          if(subCat.toLowerCase().includes(problem.toLowerCase())){
            selectProduct=[...selectProduct.filter(value=>value._id!==product._id),product]
        }

      }
    }

    // Sleep
    if(survey.sleep){
      for(const subCat of subCategories){
        if(subCat.toLowerCase().includes("sleep".toLowerCase())){
          selectProduct=[...selectProduct.filter(value=>value._id!==product._id),product]
      }
        
      }
    } 
    // pet
    else if(survey.pet){
      for(const subCat of subCategories){
        if(subCat.toLowerCase().includes("pet".toLowerCase())){
          selectProduct=[...selectProduct.filter(value=>value._id!==product._id),product]
      }
        
      }
    }
    // kids
    else
    if(survey.kids){
      for(const subCat of subCategories){
        if(subCat.toLowerCase().includes("baby".toLowerCase())){
          selectProduct=[...selectProduct.filter(value=>value._id!==product._id),product]
      }
        
      }
    }
      // supplements
    else
    if(survey.supplements){
      for(const subCat of subCategories){
        if(subCat.toLowerCase().includes("supplements".toLowerCase())){
          selectProduct=[...selectProduct.filter(value=>value._id!==product._id),product]
      }
        
      } 
    }else          // wood
    if(survey.wood){
      for(const subCat of subCategories){
        if(subCat.toLowerCase().includes("wood".toLowerCase())){
          selectProduct=[...selectProduct.filter(value=>value._id!==product._id),product]
      }
        
      }
    }
  
  });

    selectProduct = shuffleArray(selectProduct)

    selectProduct = selectProduct.filter((_,index)=>index <=8)

    return res.status(200).json({selectProduct});

  }catch(error){
    log.error("[GETSURVEY]:: " + error);
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
