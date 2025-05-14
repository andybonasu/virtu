'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: '751bd346-7c6d-4dc3-b47a-f947a52ac5ee',
        name: 'Admin User',
        email: 'admin@virtu.com',
        password_hash: 'hashed_admin_pass',
        role: 'admin',
        is_approved: true,
        background_url: null,
        created_at: '2025-05-14T02:27:20.840488'
      },
      {
        id: '1ef12fba-b6d3-48dc-920a-ad977721b3d4',
        name: 'Trainer One',
        email: 'trainer@virtu.com',
        password_hash: 'hashed_trainer_pass',
        role: 'trainer',
        is_approved: true,
        background_url: 'https://example.com/banner.jpg',
        created_at: '2025-05-14T02:27:20.840488'
      },
      {
        id: 'bf07e16e-ea5e-4d92-810b-1147e3cdea7f',
        name: 'Client One',
        email: 'client@virtu.com',
        password_hash: 'hashed_client_pass',
        role: 'client',
        is_approved: true,
        background_url: null,
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('BaseCourses', [
      {
        id: '5d64ca6f-2ea1-42bf-8016-8242036d36d6',
        trainer_id: '1ef12fba-b6d3-48dc-920a-ad977721b3d4',
        title: '7-Day Home Workout Plan',
        description: 'Simple beginner-friendly fitness plan.',
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('AssignedCourses', [
      {
        id: '8451a74a-de49-4751-b088-61b682de305d',
        base_course_id: '5d64ca6f-2ea1-42bf-8016-8242036d36d6',
        trainer_id: '1ef12fba-b6d3-48dc-920a-ad977721b3d4',
        client_id: 'bf07e16e-ea5e-4d92-810b-1147e3cdea7f',
        is_paid: true,
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('Sections', [
      {
        id: '6851977a-bc82-4336-be35-539df312ae6e',
        assigned_course_id: '8451a74a-de49-4751-b088-61b682de305d',
        title: 'Day 1 – Getting Started',
        position: 1,
        created_at: '2025-05-14T02:27:20.840488'
      },
      {
        id: '712d3ce9-d2d1-4f67-94c4-938149f2fd4d',
        assigned_course_id: '8451a74a-de49-4751-b088-61b682de305d',
        title: 'Day 2 – Warmup Routine',
        position: 2,
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('Blocks', [
      {
        id: '3f81a65c-3d97-4962-b7bb-f99251b1ed0c',
        section_id: '6851977a-bc82-4336-be35-539df312ae6e',
        text_content: 'Start with light stretching and breathing.',
        media_url: 'https://example.com/day1.mp4',
        created_at: '2025-05-14T02:27:20.840488'
      },
      {
        id: '1ce0520d-57e0-4ca1-8a68-f365abdee62c',
        section_id: '712d3ce9-d2d1-4f67-94c4-938149f2fd4d',
        text_content: 'Warm up with jumping jacks and lunges.',
        media_url: null,
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('Submissions', [
      {
        id: '19ce98d2-626c-41a5-9df4-ba7ec3489fb7',
        section_id: '6851977a-bc82-4336-be35-539df312ae6e',
        client_id: 'bf07e16e-ea5e-4d92-810b-1147e3cdea7f',
        text_response: 'Completed the exercises!',
        media_url: 'https://example.com/client_submission.jpg',
        submitted_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('PublicCourses', [
      {
        id: '72370f21-8d9d-41f2-a616-02cbfd14ce75',
        base_course_id: '5d64ca6f-2ea1-42bf-8016-8242036d36d6',
        trainer_id: '1ef12fba-b6d3-48dc-920a-ad977721b3d4',
        title: '7-Day Home Workout Plan',
        description: 'Try this easy at-home fitness challenge.',
        price: 29.99,
        image_url: 'https://example.com/banner.jpg',
        is_approved: false,
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('Payments', [
      {
        id: 'd18c1d37-767e-4c5b-bcb4-3afa3dd38b4e',
        client_id: 'bf07e16e-ea5e-4d92-810b-1147e3cdea7f',
        trainer_id: '1ef12fba-b6d3-48dc-920a-ad977721b3d4',
        assigned_course_id: '8451a74a-de49-4751-b088-61b682de305d',
        amount: 29.99,
        status: 'paid',
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('Conversations', [
      {
        id: '1cd20e7e-5be7-46aa-adf0-073b6c1c25c7',
        user1_id: 'bf07e16e-ea5e-4d92-810b-1147e3cdea7f',
        user2_id: '1ef12fba-b6d3-48dc-920a-ad977721b3d4',
        last_updated: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('Messages', [
      {
        id: 'f73f5a2e-8c69-480e-a7bf-1333bf92f190',
        conversation_id: '1cd20e7e-5be7-46aa-adf0-073b6c1c25c7',
        sender_id: 'bf07e16e-ea5e-4d92-810b-1147e3cdea7f',
        message: 'Thanks for the course!',
        is_read: false,
        timestamp: '2025-05-14T02:27:20.840488'
      }
    ]);

    await queryInterface.bulkInsert('AdminActions', [
      {
        id: '3ef22856-6b30-48c7-9e8f-0ab65d17bc1d',
        admin_id: '751bd346-7c6d-4dc3-b47a-f947a52ac5ee',
        action_type: 'approve_trainer',
        target_id: '1ef12fba-b6d3-48dc-920a-ad977721b3d4',
        created_at: '2025-05-14T02:27:20.840488'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AdminActions', null, {});
    await queryInterface.bulkDelete('Messages', null, {});
    await queryInterface.bulkDelete('Conversations', null, {});
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('PublicCourses', null, {});
    await queryInterface.bulkDelete('Submissions', null, {});
    await queryInterface.bulkDelete('Blocks', null, {});
    await queryInterface.bulkDelete('Sections', null, {});
    await queryInterface.bulkDelete('AssignedCourses', null, {});
    await queryInterface.bulkDelete('BaseCourses', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
