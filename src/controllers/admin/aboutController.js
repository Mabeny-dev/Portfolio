import prisma from "../../../prisma/prisma.client.js";

const aboutContentInclude = {
  skills: true,
  experiences: true,
  educations: true,
  achievements: true,
  languages: true,
};

const isString = (value) => typeof value === "string";

const normalizeSkill = (skill) => ({
  category: skill.category.trim(),
  // Keep only non-empty strings so the UI can send partially edited arrays safely.
  items: Array.isArray(skill.items)
    ? skill.items
        .filter((item) => isString(item) && item.trim().length > 0)
        .map((item) => item.trim())
    : [],
});

const normalizeExperience = (experience) => ({
  role: experience.role.trim(),
  company: experience.company.trim(),
  period: experience.period.trim(),
  description: experience.description.trim(),
});

const normalizeEducation = (education) => ({
  degree: education.degree.trim(),
  school: education.school.trim(),
  year: education.year.trim(),
});

const normalizeAchievement = (achievement) => ({
  issuer: achievement.issuer.trim(),
  year: achievement.year.trim(),
});

const normalizeLanguage = (language) => ({
  name: language.name.trim(),
  proficiency: language.proficiency.trim(),
});

const validateAboutPayload = (body) => {
  const {
    bio,
    skills = [],
    experiences = [],
    educations = [],
    achievements = [],
    languages = [],
  } = body;

  if (!isString(bio) || bio.trim().length === 0) {
    return { error: "bio is required" };
  }

  if (!Array.isArray(skills)) {
    return { error: "skills must be an array" };
  }

  if (!Array.isArray(experiences)) {
    return { error: "experiences must be an array" };
  }

  if (!Array.isArray(educations)) {
    return { error: "educations must be an array" };
  }

  if (!Array.isArray(achievements)) {
    return { error: "achievements must be an array" };
  }

  if (!Array.isArray(languages)) {
    return { error: "languages must be an array" };
  }

  for (const skill of skills) {
    if (!isString(skill?.category) || skill.category.trim().length === 0) {
      return { error: "Each skill category must include a category" };
    }

    if (!Array.isArray(skill.items)) {
      return { error: "Each skill category must include an items array" };
    }
  }

  for (const experience of experiences) {
    if (
      !isString(experience?.role) ||
      !isString(experience?.company) ||
      !isString(experience?.period) ||
      !isString(experience?.description) ||
      experience.role.trim().length === 0 ||
      experience.company.trim().length === 0 ||
      experience.period.trim().length === 0 ||
      experience.description.trim().length === 0
    ) {
      return {
        error:
          "Each experience must include role, company, period, and description",
      };
    }
  }

  for (const education of educations) {
    if (
      !isString(education?.degree) ||
      !isString(education?.school) ||
      !isString(education?.year) ||
      education.degree.trim().length === 0 ||
      education.school.trim().length === 0 ||
      education.year.trim().length === 0
    ) {
      return {
        error: "Each education must include degree, school, and year",
      };
    }
  }

  for (const achievement of achievements) {
    if (
      !isString(achievement?.issuer) ||
      !isString(achievement?.year) ||
      achievement.issuer.trim().length === 0 ||
      achievement.year.trim().length === 0
    ) {
      return {
        error: "Each achievement must include issuer and year",
      };
    }
  }

  for (const language of languages) {
    if (
      !isString(language?.name) ||
      !isString(language?.proficiency) ||
      language.name.trim().length === 0 ||
      language.proficiency.trim().length === 0
    ) {
      return {
        error: "Each language must include name and proficiency",
      };
    }
  }

  return {
    data: {
      bio: bio.trim(),
      skills: skills.map(normalizeSkill),
      experiences: experiences.map(normalizeExperience),
      educations: educations.map(normalizeEducation),
      achievements: achievements.map(normalizeAchievement),
      languages: languages.map(normalizeLanguage),
    },
  };
};

const getAboutAdmin = async (req, res) => {
  try {
    // The admin dashboard edits a single About page document, so we always
    // return the first record along with every nested section it owns.
    const aboutContent = await prisma.aboutContent.findFirst({
      include: aboutContentInclude,
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(aboutContent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createAbout = async (req, res) => {
  try {
    const validation = validateAboutPayload(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const existingAboutContent = await prisma.aboutContent.findFirst({
      select: { id: true },
    });

    if (existingAboutContent) {
      return res.status(409).json({
        message:
          "About content already exists. Use the update endpoint instead.",
      });
    }

    const { bio, skills, experiences, educations, achievements, languages } =
      validation.data;

    const aboutContent = await prisma.aboutContent.create({
      data: {
        bio,
        skills: {
          create: skills,
        },
        experiences: {
          create: experiences,
        },
        educations: {
          create: educations,
        },
        achievements: {
          create: achievements,
        },
        languages: {
          create: languages,
        },
      },
      include: aboutContentInclude,
    });

    return res.status(201).json({
      status: "SUCCESS",
      data: aboutContent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateAboutPayload(req.body);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { bio, skills, experiences, educations, achievements, languages } =
      validation.data;

    // Replace nested collections inside a transaction so the About page never
    // ends up half-updated if one step fails.
    const updatedAboutContent = await prisma.$transaction(async (tx) => {
      const existingAboutContent = await tx.aboutContent.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existingAboutContent) {
        throw Object.assign(new Error("About content not found"), {
          code: "P2025",
        });
      }

      await tx.skill.deleteMany({
        where: { aboutContentId: id },
      });

      await tx.experience.deleteMany({
        where: { aboutContentId: id },
      });

      await tx.education.deleteMany({
        where: { aboutContentId: id },
      });

      await tx.achievement.deleteMany({
        where: { aboutContentId: id },
      });

      await tx.language.deleteMany({
        where: { aboutContentId: id },
      });

      await tx.aboutContent.update({
        where: { id },
        data: { bio },
      });

      if (skills.length > 0) {
        await tx.skill.createMany({
          data: skills.map((skill) => ({
            ...skill,
            aboutContentId: id,
          })),
        });
      }

      if (experiences.length > 0) {
        await tx.experience.createMany({
          data: experiences.map((experience) => ({
            ...experience,
            aboutContentId: id,
          })),
        });
      }

      if (educations.length > 0) {
        await tx.education.createMany({
          data: educations.map((education) => ({
            ...education,
            aboutContentId: id,
          })),
        });
      }

      if (achievements.length > 0) {
        await tx.achievement.createMany({
          data: achievements.map((achievement) => ({
            ...achievement,
            aboutContentId: id,
          })),
        });
      }

      if (languages.length > 0) {
        await tx.language.createMany({
          data: languages.map((language) => ({
            ...language,
            aboutContentId: id,
          })),
        });
      }

      return tx.aboutContent.findUnique({
        where: { id },
        include: aboutContentInclude,
      });
    });

    return res.status(200).json({
      status: "SUCCESS",
      data: updatedAboutContent,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "About content not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.aboutContent.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "SUCCESS",
      message: "About content deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "About content not found" });
    }

    return res.status(500).json({ message: error.message });
  }
};

export { getAboutAdmin, createAbout, updateAbout, deleteAbout };
