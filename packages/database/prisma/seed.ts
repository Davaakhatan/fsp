import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create locations
  const paeLocation = await prisma.location.create({
    data: {
      name: 'KPAE - Paine Field',
      latitude: 47.9063,
      longitude: -122.2817,
      timezone: 'America/Los_Angeles',
    },
  });

  const bfiLocation = await prisma.location.create({
    data: {
      name: 'KBFI - Boeing Field',
      latitude: 47.53,
      longitude: -122.3016,
      timezone: 'America/Los_Angeles',
    },
  });

  console.log('✅ Created locations');

  // Create instructors
  const instructor1 = await prisma.instructor.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@flightschool.com',
      phone: '+14255550100',
    },
  });

  const instructor2 = await prisma.instructor.create({
    data: {
      name: 'Mike Davis',
      email: 'mike@flightschool.com',
      phone: '+14255550101',
    },
  });

  console.log('✅ Created instructors');

  // Create aircraft
  const aircraft1 = await prisma.aircraft.create({
    data: {
      registration: 'N12345',
      model: 'Cessna 172',
    },
  });

  const aircraft2 = await prisma.aircraft.create({
    data: {
      registration: 'N67890',
      model: 'Cessna 172',
    },
  });

  console.log('✅ Created aircraft');

  // Create students
  const studentPilot = await prisma.student.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+14255550200',
      trainingLevel: 'STUDENT',
    },
  });

  const privatePilot = await prisma.student.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+14255550201',
      trainingLevel: 'PRIVATE',
    },
  });

  const instrumentPilot = await prisma.student.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+14255550202',
      trainingLevel: 'INSTRUMENT',
    },
  });

  console.log('✅ Created students');

  // Create sample bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  await prisma.booking.create({
    data: {
      studentId: studentPilot.id,
      instructorId: instructor1.id,
      aircraftId: aircraft1.id,
      departureLocationId: paeLocation.id,
      destinationLocationId: bfiLocation.id,
      scheduledTime: tomorrow,
      durationMinutes: 60,
      status: 'SCHEDULED',
    },
  });

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  await prisma.booking.create({
    data: {
      studentId: privatePilot.id,
      instructorId: instructor2.id,
      aircraftId: aircraft2.id,
      departureLocationId: bfiLocation.id,
      scheduledTime: dayAfter,
      durationMinutes: 90,
      status: 'SCHEDULED',
    },
  });

  console.log('✅ Created sample bookings');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

