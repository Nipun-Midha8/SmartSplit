const prisma = require('./prismaClient');

async function createGroup(req, res) {
  const { name } = req.body;
  const userId = req.userId;

  const group = await prisma.group.create({
    data: {
      name,
      createdBy: userId,
      members: {
        create: { userId },
      },
    },
    include: { members: true },
  });

  res.status(201).json(group);
}

async function getMyGroups(req, res) {
  const userId = req.userId;

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: { members: true },
  });

  res.json(groups);
}

async function addMember(req, res) {
  const { groupId } = req.params;
  const { userId } = req.body;

  const member = await prisma.groupMember.create({
    data: { groupId, userId },
  });

  res.status(201).json(member);
}

module.exports = { createGroup, getMyGroups, addMember };