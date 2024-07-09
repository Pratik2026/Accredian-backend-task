import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seed courses
  await prisma.course.createMany({
    data: [
      {
        name: "Introduction to Programming",
        referrerBonus: 20.0,
        refereeBonus: 10.0,
      },
      {
        name: "Advanced Web Development",
        referrerBonus: 30.0,
        refereeBonus: 15.0,
      },
      {
        name: "Data Science Fundamentals",
        referrerBonus: 25.0,
        refereeBonus: 12.5,
      },
      {
        name: "Machine Learning Basics",
        referrerBonus: 35.0,
        refereeBonus: 17.5,
      },
      {
        name: "Cybersecurity Essentials",
        referrerBonus: 40.0,
        refereeBonus: 20.0,
      },
      {
        name: "Cloud Computing Introduction",
        referrerBonus: 22.0,
        refereeBonus: 11.0,
      },
      {
        name: "Mobile App Development",
        referrerBonus: 28.0,
        refereeBonus: 14.0,
      },
      {
        name: "Database Management Systems",
        referrerBonus: 32.0,
        refereeBonus: 16.0,
      },
      {
        name: "Network Administration",
        referrerBonus: 29.0,
        refereeBonus: 14.5,
      },
      {
        name: "Artificial Intelligence",
        referrerBonus: 50.0,
        refereeBonus: 25.0,
      },
    ],
  });

  // Fetch the courses to use their IDs in referrals
  const courses = await prisma.course.findMany();

  // Seed referrals
  await prisma.referral.createMany({
    data: [
      {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        referredBy: "Bob Smith",
        message: "Great course!",
        courseId: courses[0].id,
      },
      {
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        referredBy: "David Wilson",
        message: "Highly recommended.",
        courseId: courses[1].id,
      },
      {
        name: "Eve Davis",
        email: "eve.davis@example.com",
        referredBy: "Frank Miller",
        message: "Excellent content!",
        courseId: courses[2].id,
      },
      {
        name: "Grace Lee",
        email: "grace.lee@example.com",
        referredBy: "Hannah Taylor",
        message: "Very informative.",
        courseId: courses[3].id,
      },
      {
        name: "Ivy White",
        email: "ivy.white@example.com",
        referredBy: "Jack Harris",
        message: "Loved it!",
        courseId: courses[4].id,
      },
      {
        name: "Karen Lewis",
        email: "karen.lewis@example.com",
        referredBy: "Larry Scott",
        message: "Superb teaching.",
        courseId: courses[5].id,
      },
      {
        name: "Mike Adams",
        email: "mike.adams@example.com",
        referredBy: "Nancy Parker",
        message: "Highly engaging.",
        courseId: courses[6].id,
      },
      {
        name: "Olivia Roberts",
        email: "olivia.roberts@example.com",
        referredBy: "Paul Evans",
        message: "Very helpful.",
        courseId: courses[7].id,
      },
      {
        name: "Quinn Baker",
        email: "quinn.baker@example.com",
        referredBy: "Rachel Moore",
        message: "Great insights.",
        courseId: courses[8].id,
      },
      {
        name: "Sam Carter",
        email: "sam.carter@example.com",
        referredBy: "Tina Morgan",
        message: "Amazing experience.",
        courseId: courses[9].id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Database seeded successfully.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
