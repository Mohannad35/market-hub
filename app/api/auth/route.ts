import { VerificationTemplate } from "@/emails/verification-template";
import WelcomeTemplate from "@/emails/welcome-template";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { signUpSchema } from "@/lib/validation/user-schema";
import prisma from "@/prisma/client";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Gender, User } from "@prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  console.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * API route to create a new user
 * @param request NextRequest object
 * @returns { Promise<NextResponse<User>> }
 * @returns returns the created user if successfully created
 * @returns returns an error message if the request body is invalid with status 400
 * @returns returns an error message if the user email already exists with status 400
 * @access public
 * @method POST
 * @example /api/auth
 */
async function POST_handler(request: NextRequest): Promise<NextResponse<User>> {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = signUpSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Check if the user already exists
  const { email, password, username, phoneNumber, gender } = data;
  // Check if email already exists
  if (await prisma.user.findUnique({ where: { email } }))
    throw new ApiError(400, "Email already exists.");
  // Check if username already exists
  if (await prisma.user.findUnique({ where: { username } }))
    throw new ApiError(400, "Username not available.");
  // Check if the phone number already exists
  if (phoneNumber && (await prisma.user.findFirst({ where: { phoneNumber } })))
    throw new ApiError(400, "Phone number already exists.");
  // Hash the password, Create the user, and return it
  const pwHash = await hash(password, 10);

  // Create verification token
  const emailVerificationToken = randomBytes(16).toString("hex");
  const user = await prisma.user.create({
    data: {
      ...data,
      password: pwHash,
      gender: gender as Gender,
      verificationToken: {
        create: {
          token: emailVerificationToken,
          expires: now(getLocalTimeZone()).add({ days: 2 }).toDate(),
        },
      },
    },
    include: { verificationToken: true },
  });
  // Send verification email and welcome email
  const welcomeEmailHtml = render(WelcomeTemplate({ name: user.name }));
  const verificationEmailHtml = render(
    VerificationTemplate({
      username: user.name,
      emailVerificationToken: user.verificationToken!.token,
      baseUrl: request.nextUrl.origin,
    })
  );
  await sendgrid
    .send({
      from: "mohannadragab53@gmail.com",
      to: user.email!,
      subject: "Welcome aboard!",
      html: welcomeEmailHtml,
    })
    .then(() => console.log("Email sent"))
    .catch(error => console.error(error));
  await sendgrid
    .send({
      from: "mohannadragab53@gmail.com",
      to: user.email!,
      subject: "Email Verification",
      html: verificationEmailHtml,
    })
    .then(() => console.log("Email sent"))
    .catch(error => console.error(error));

  return NextResponse.json(user, { status: 201 });
}

export const POST = wrapperMiddleware(POST_handler);
