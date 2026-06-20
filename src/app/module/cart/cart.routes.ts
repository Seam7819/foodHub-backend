import { Router } from "express";

import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";

import { CartController } from "./cart.controller.js";
import { CartValidation } from "./cart.validation.js";

const router = Router();

router.post(
  "/add",
  auth("CUSTOMER"),
  validateRequest(
    CartValidation.addToCartValidationSchema
  ),
  CartController.addToCart
);

router.post(
  "/",
  auth("CUSTOMER"),
  validateRequest(
    CartValidation.addToCartValidationSchema
  ),
  CartController.addToCart
);
router.get(
  "/",
  auth("CUSTOMER"),
  CartController.getMyCart
);
router.patch(
  "/item/:id",
  auth("CUSTOMER"),
  validateRequest(
    CartValidation.updateCartItemValidationSchema
  ),
  CartController.updateCartItem
);
router.delete(
  "/item/:id",
  auth("CUSTOMER"),
  CartController.removeCartItem
);

router.delete(
  "/clear",
  auth("CUSTOMER"),
  CartController.clearCart
);

export const CartRoutes = router;