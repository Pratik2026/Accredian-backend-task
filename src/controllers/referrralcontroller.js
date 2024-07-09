import { PrismaClient } from "@prisma/client";
import { sendReferralEmail } from "../utils/mailservice.js";

const prisma = new PrismaClient();

const getCoursesController = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching courses." });
  }
};

const referralController = async (req, res) => {
  const { name, email, referredBy, message, courseId } = req.body;

  if (!name || !email || !referredBy || !courseId) {
    return res.status(400).json({
      error: "Name, email, referredBy, and courseId are required fields.",
    });
  }

  const parsedcourseId = parseInt(courseId);

  try {
    const course = await prisma.course.findUnique({
      where: { id: parsedcourseId },
    });
    if (!course) {
      return res.status(400).json({ error: "Invalid parsedcourseId." });
    }

    const referral = await prisma.referral.create({
      data: { name, email, referredBy, message, courseId: parsedcourseId },
    });

    const subject = "Regarding Referral";
    const emailText =
      `Hello ${name},\n\nYou have been referred by ${referredBy} for the course ${course.name}. ` +
      `You have received a bonus of $${course.refereeBonus}. Your referrer will receive a bonus of $${course.referrerBonus}. ` +
      `Here is the message: ${message}\n\nBest regards,\nYour Company`;

    sendReferralEmail(email, subject, emailText);

    res.status(201).json(referral);
  } catch (error) {
    console.error("Error processing referral:", error);
    if (error.code === "P2002") {
      res
        .status(400)
        .json({ error: "A referral with this email already exists." });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
    }
  }
};

export { referralController, getCoursesController };
