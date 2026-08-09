import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    console.log("\n========== AUTH DEBUG ==========");
    console.log("Authenticated:", isAuthenticated);
    console.log("Clerk User ID:", userId);

    if (!isAuthenticated || !userId) {
      console.log("❌ User is not authenticated");

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find user in MongoDB
    let user = await User.findOne({
      clerkId: userId,
    });

    // User doesn't exist in MongoDB
    if (!user) {
      console.log(
        "⚠️ User not found in MongoDB. Creating user..."
      );

      // Get user information from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      const email =
        clerkUser.primaryEmailAddress?.emailAddress ||
        clerkUser.emailAddresses?.[0]?.emailAddress;

      const name =
        `${clerkUser.firstName || ""} ${
          clerkUser.lastName || ""
        }`.trim() ||
        clerkUser.username ||
        "User";

      if (!email) {
        console.log("❌ Clerk user has no email");

        return res.status(400).json({
          success: false,
          message: "No email found for Clerk user",
        });
      }

      // Create MongoDB user
      user = await User.findOneAndUpdate(
        {
          clerkId: userId,
        },
        {
          $set: {
            clerkId: userId,
            name,
            email,
            profileImage: clerkUser.imageUrl || "",
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log("✅ User created in MongoDB");
    } else {
      console.log("✅ User already exists in MongoDB");
    }

    console.log("MongoDB User ID:", user._id);
    console.log("MongoDB Clerk ID:", user.clerkId);
    console.log("MongoDB Email:", user.email);
    console.log("================================\n");

    // Attach MongoDB user
    req.user = user;

    next();

  } catch (error) {
    console.error("\n❌ PROTECT ROUTE ERROR");
    console.error(error);
    console.error("========================\n");

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};