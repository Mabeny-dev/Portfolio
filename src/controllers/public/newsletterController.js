import prisma from "../../../prisma/prisma.client.js";
import { getClientIp } from "../../utils/getClientIp.js";
import { getOrCreateVisitor } from "../../utils/getOrCreateVisitor.js";
import { sendNewsletterWelcomeEmail } from "../../utils/sendNewsletterWelcomeEmail.js";

const subscriberSelect = {
  id: true,
  email: true,
  country: true,
  city: true,
  countryCode: true,
  welcomeEmailSentAt: true,
  createdAt: true,
};

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isValidEmail = (email) =>
  email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const toPublicSubscriber = (subscriber) => ({
  id: subscriber.id,
  email: subscriber.email,
  country: subscriber.country,
  city: subscriber.city,
  countryCode: subscriber.countryCode,
  createdAt: subscriber.createdAt,
});

const sendWelcomeEmail = async (subscriber) => {
  if (subscriber.welcomeEmailSentAt) return;

  const deliveryStartedAt = new Date();
  const claim = await prisma.newsletterSubscriber.updateMany({
    where: {
      id: subscriber.id,
      welcomeEmailSentAt: null,
    },
    data: {
      welcomeEmailSentAt: deliveryStartedAt,
    },
  });

  if (claim.count === 0) return;

  try {
    const sent = await sendNewsletterWelcomeEmail(subscriber.email);
    if (sent) return;
  } catch (error) {
    // Keep the subscription even if the email provider is temporarily unavailable.
    console.error("Newsletter welcome email failed:", error);
  }

  // Release the claim so another signup attempt can retry a failed delivery.
  await prisma.newsletterSubscriber.updateMany({
    where: {
      id: subscriber.id,
      welcomeEmailSentAt: deliveryStartedAt,
    },
    data: {
      welcomeEmailSentAt: null,
    },
  });
};

const subscribe = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "A valid email address is required",
      });
    }

    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: subscriberSelect,
    });

    if (existingSubscriber) {
      await sendWelcomeEmail(existingSubscriber);

      return res.status(200).json({
        status: "SUCCESS",
        data: toPublicSubscriber(existingSubscriber),
      });
    }

    const visitor = await getOrCreateVisitor(getClientIp(req), req);
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        country: visitor.country,
        city: visitor.city,
        countryCode: visitor.countryCode,
        visitorId: visitor.id,
      },
      select: subscriberSelect,
    });

    await sendWelcomeEmail(subscriber);

    return res.status(201).json({
      status: "SUCCESS",
      data: toPublicSubscriber(subscriber),
    });
  } catch (error) {
    // A simultaneous request for the same email should remain idempotent.
    if (error.code === "P2002") {
      const email = normalizeEmail(req.body.email);
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email },
        select: subscriberSelect,
      });

      if (subscriber) {
        await sendWelcomeEmail(subscriber);

        return res.status(200).json({
          status: "SUCCESS",
          data: toPublicSubscriber(subscriber),
        });
      }
    }

    console.error("Newsletter subscription failed:", error);
    return res.status(500).json({ message: "Failed to subscribe" });
  }
};

export { subscribe };
