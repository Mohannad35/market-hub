import OrderPlacedTemplate from "@/emails/order-placed-template";
import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { orderSchema } from "@/lib/validation/order-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { Coupon, User } from "@prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import moment from "moment";
import { customAlphabet } from "nanoid";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function POST_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = orderSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { address, email, payment, phone, cartId, couponId } = data;
  // Check if the user has an active cart or the cartId is provided
  if (!user.activeCartId && !cartId) throw new ApiError(400, "Cart not found");
  // Get the cart of the user
  const cart = await prisma.cart.findUnique({
    where: { id: user.activeCartId || cartId },
    include: { cartItems: { include: { product: true } } },
  });
  if (!cart) throw new ApiError(404, "Cart not found");
  // Check if the cart is empty
  if (cart.cartItems.length <= 0) throw new ApiError(400, "Cart is empty");
  let total = 0;
  let discount = 0;
  let coupon: Coupon | null = null;
  // Get coupon if provided
  if (couponId) {
    coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) throw new ApiError(404, "Coupon not found");
    // Calculate the total price of the cart
    for (const cartItem of cart.cartItems) {
      const itemPrice = cartItem.product.price;
      const isActive =
        coupon.isActive &&
        new Date(coupon.startDate) < new Date() &&
        new Date(coupon.endDate) > new Date() &&
        (coupon.type === "admin" || coupon.userId === cartItem.product.vendorId);
      if (isActive) {
        const discountValue = coupon.maxAmount
          ? Math.min(itemPrice * (coupon.value / 100), coupon.maxAmount)
          : itemPrice * (coupon.value / 100);
        discount += discountValue * cartItem.quantity;
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { priceAfter: itemPrice - discountValue },
        });
      }
      total += itemPrice * cartItem.quantity;
    }
  }
  // Create the order
  const order = await prisma.order.create({
    data: {
      code: `${parseInt(moment().format("X"), 10).toString(16).toUpperCase()}-${nanoid(8).toUpperCase()}`,
      address,
      email,
      payment,
      bill: total - discount,
      discount,
      phone,
      cart: { connect: { id: cart.id } },
      user: { connect: { id: user.id } },
      coupon: { connect: { id: coupon?.id || undefined } },
    },
  });
  if (process.env.SENDGRID_API_KEY) {
    // Send order placed email
    const orderPlacedEmailHtml = render(
      OrderPlacedTemplate({
        name: user.name,
        username: user.username,
        baseUrl: request.nextUrl.origin,
        order,
        items: cart.cartItems.map(cartItem => cartItem.product),
      })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: email,
        subject: "Order Placed",
        html: orderPlacedEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }
  // Change the status of the cart to ordered
  await prisma.cart.update({ where: { id: cart.id }, data: { status: "ordered" } });
  // Remove the active cart from the user
  await prisma.user.update({ where: { id }, data: { activeCartId: null } });

  return NextResponse.json(order, { status: 201 });
}

export const POST = wrapperMiddleware(authMiddleware, POST_handler);
