import { sendEmail } from "../utils/sendmail";
import { randomstring } from "../utils/randomstring";
import {
  createForgetSession,
  deleteForgetSession,
  findForgetSession,
  findResetPasswordEmail,
} from "../service/forgetPassword.service";

import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import log from "../utils/logger";
import bcrypt from "bcrypt";
import { findAndUpdateUser, findUser } from "../service/user.service";
import { textToHash } from "../utils/textToHash";

// resetPassword
// 1. send otp
export async function resetPasswordEmail(req: Request, res: Response) {
  try {
    if (res.locals.user) {
      return res.status(403).json({ message: "You are already logged in." });
    }
    const userMail = await findResetPasswordEmail(req.body);


    if (!userMail || userMail.length === 0) {
      return res.sendStatus(404);
    }

    // console.log(userMail[0].email);

    const token = uuid();
    const email = userMail[0].email;
    const otp = randomstring(6);

    // weather this user previous request of reset password
    const previousForgetRequest = await findForgetSession({ email });

    if (previousForgetRequest && previousForgetRequest.length > 0) {

      const isAllowed =
        new Date().getTime() -
        new Date(previousForgetRequest[0].updatedAt).getTime();

      if (isAllowed < 60000) {
        return res.sendStatus(425);
      }

      await deleteForgetSession({ email });
    //   console.log("previous token is deleted successfully.", response);
    }

    const mailresponse = await sendEmail(email,'otp',"Recover password otp",{otpnumber:otp});

    if (mailresponse.rejected.length > 0) {
      throw new Error("Message is rejected");
    }

     await createForgetSession({ email, token, otp });

    console.log("Session created");

    // console.log(forgetResponse);
    // console.log("Current token is ",token)

    return res.status(200).json({ token: token });
  } catch (e) {
    log.error("[ResetPassword]:: " + e);
    if (e instanceof Error) {
      return res.status(500).json(e.message);
    } else {
      return res.sendStatus(500);
    }
  }
}

// 2. verify mail
export async function resetPasswordMailVerification(
  req: Request,
  res: Response
) {
  const { token } = req.params;

  const { otp } = req.body;

  try {
    const forgetPasswordUser = await findForgetSession({ token });

    // checking weather forgetPassword session initiated or not.

    if (!forgetPasswordUser || forgetPasswordUser.length === 0) {
      return res.status(403).json({ message: "Not allowed!!" });
    }

    // Token should be used within 15 mins

    const isValidTime =
      new Date().getTime() -
      new Date(forgetPasswordUser[0].updatedAt).getTime();

    if (isValidTime > 900000) {
      await deleteForgetSession({ token });
      return res
        .status(404)
        .json({ message: "Token is valid for 15 min only." });
    }

    // verify otp

    const isValidOTP = await bcrypt.compare(otp, forgetPasswordUser[0].otp);
    console.log(isValidOTP);

    if (!isValidOTP) {
      return res.status(403).json({ message: "Not valid otp." });
    }

    res.cookie("usermail", forgetPasswordUser[0].email, {
      sameSite: "strict",
      maxAge: 86400000, // 1 day
      httpOnly: false,
      secure: false,
    });
    res.status(200).json({ message: "OTP Successfully verified" });
  } catch (e) {
    log.error("[ResetPasswordVerfication]:: " + e);
    if (e instanceof Error) {
      return res.status(500).json(e.message);
    } else {
      return res.sendStatus(500);
    }
  }
}

// 3. allow to reset Password

export async function resetPassword(req: Request, res: Response) {
  const { password } = req.body;

  const email = res.locals.email;

  try {

    const validUser = await findUser({ email });

    if (!validUser) {
      return res.sendStatus(404);
    }

    const hashPassword = await textToHash(password);

    await findAndUpdateUser(
      { email },
      { password: hashPassword },
      { new: true }
    );

    res.clearCookie("usermail", {
      httpOnly: false,
      sameSite: "strict",
      secure: false,
    });
    return res.sendStatus(200);
  } catch (e) {
    log.error("[ResetPasswordVerfication]:: " + e);
    if (e instanceof Error) {
      return res.status(500).json(e.message);
    } else {
      return res.sendStatus(500);
    }
  }
}
