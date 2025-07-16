import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  UserProductErrorHandling,
  UserProductResponse,
  Messages,
} from "../helpers/helper";
import {
  deleteProductDataService,
  deleteUserService,
  fetchUsers,
  getAllProductsService,
  createNewProductService,
  updateProductDataService,
  updateUserRoleService,
} from "../services/adminServices";

const {
  USERS_GOTTEN_SUCESSFULLY,
  PRODUCTS_GOTTEN_SUCESSFULLY,
  USER_NOT_FOUND,
  PRODUCT_NOT_FOUND,
  ID_NOT_FOUND,
  PRODUCT_CREATED,
  USER_PRODUCT_UPDATED,
  USER_DELETED,
  PRODUCT_DELETED,
  ERROROCCURS,
} = Messages;

/* ✅ Get all users */
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const users = await fetchUsers();
    if (!users) {
      res.status(404).json({ error: USER_NOT_FOUND });
      return;
    }
    UserProductResponse(res, USERS_GOTTEN_SUCESSFULLY, users);
  }
);

/* ✅ Update a user's role */
export const updateUserRole = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { role } = req.body;
    const { id } = req.params;
    const user = await updateUserRoleService(id, role);

    if (!UserProductErrorHandling(res, user, 404, USER_NOT_FOUND)) return;
    UserProductResponse(res, USER_PRODUCT_UPDATED, user);
  }
);

/* ✅ Delete a user */
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const deleted = await deleteUserService(id);

    if (!UserProductErrorHandling(res, deleted, 404, USER_NOT_FOUND)) return;

    UserProductResponse(res, USER_DELETED);
  }
);

/* ✅ Get all products */
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const products = await getAllProductsService();
    if (!products) {
      res.status(404).json({ error: PRODUCT_NOT_FOUND });
      return;
    }
    UserProductResponse(res, PRODUCTS_GOTTEN_SUCESSFULLY, products);
  }
);

/* ✅ Create a new product */
export const newProductData = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const product = await createNewProductService(req.body);
    if (!UserProductErrorHandling(res, product, 500, ERROROCCURS)) return;
    UserProductResponse(res, PRODUCT_CREATED, product);
  }
);

/* ✅ Update a product */
export const updateProductData = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!UserProductErrorHandling(res, id, 400, ID_NOT_FOUND)) return;

    const product = await updateProductDataService(req.body, id);

    if (!UserProductErrorHandling(res, product, 404, PRODUCT_NOT_FOUND)) return;

    UserProductResponse(res, USER_PRODUCT_UPDATED, product);
  }
);

/* ✅ Delete a product */
export const deleteProductData = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!UserProductErrorHandling(res, id, 400, ID_NOT_FOUND)) return;

    const deleted = await deleteProductDataService(id);

    if (!UserProductErrorHandling(res, deleted, 404, PRODUCT_NOT_FOUND)) return;

    UserProductResponse(res, PRODUCT_DELETED);
  }
);
