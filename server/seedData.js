const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Payment = require('./models/Payment');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_payment');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Payment.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const demoUsers = [
      {
        name: 'Budi Santoso',
        email: 'parent@demo.com',
        password: 'password123',
        role: 'parent',
        children: [
          {
            name: 'Andi Santoso',
            studentId: 'SMP001',
            class: '7A',
            grade: 'SMP'
          },
          {
            name: 'Sari Santoso',
            studentId: 'SMP002',
            class: '9B',
            grade: 'SMP'
          }
        ]
      },
      {
        name: 'Admin Sekolah',
        email: 'admin@demo.com',
        password: 'password123',
        role: 'admin',
        children: []
      }
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create demo payments for parent user
    const parentUser = createdUsers.find(user => user.role === 'parent');
    
    const demoPayments = [
      {
        userId: parentUser._id,
        studentId: 'SMP001',
        studentName: 'Andi Santoso',
        paymentType: 'spp',
        amount: 500000,
        description: 'SPP Bulan Oktober 2024',
        status: 'pending',
        dueDate: new Date('2024-10-31')
      },
      {
        userId: parentUser._id,
        studentId: 'SMP001',
        studentName: 'Andi Santoso',
        paymentType: 'kegiatan',
        amount: 150000,
        description: 'Biaya Study Tour',
        status: 'pending',
        dueDate: new Date('2024-11-15')
      },
      {
        userId: parentUser._id,
        studentId: 'SMP002',
        studentName: 'Sari Santoso',
        paymentType: 'spp',
        amount: 500000,
        description: 'SPP Bulan Oktober 2024',
        status: 'completed',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        blockchainConfirmed: true,
        paidAt: new Date('2024-10-01')
      },
      {
        userId: parentUser._id,
        studentId: 'SMP002',
        studentName: 'Sari Santoso',
        paymentType: 'kantin',
        amount: 100000,
        description: 'Top-up Saldo Kantin',
        status: 'completed',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        blockchainConfirmed: true,
        paidAt: new Date('2024-09-28')
      },
      {
        userId: parentUser._id,
        studentId: 'SMP001',
        studentName: 'Andi Santoso',
        paymentType: 'donasi',
        amount: 200000,
        description: 'Donasi Pembangunan Perpustakaan',
        status: 'pending'
      }
    ];

    for (const paymentData of demoPayments) {
      const payment = new Payment(paymentData);
      await payment.save();
      console.log(`Created payment: ${payment.description}`);
    }

    console.log('Demo data seeded successfully!');
    console.log('\nDemo Accounts:');
    console.log('Parent: parent@demo.com / password123');
    console.log('Admin: admin@demo.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();