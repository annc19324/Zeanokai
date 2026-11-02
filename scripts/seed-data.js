const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_QHDLurXb21te@ep-hidden-art-aoaogril-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function seed() {
  try {
    const existing = await sql`SELECT count(*) FROM tutoring_sessions`;
    if (parseInt(existing[0].count, 10) > 0) {
      console.log(`Database already has ${existing[0].count} sessions. Skipping seed.`);
      return;
    }

    console.log('Seeding sample tutoring sessions...');

    const sampleSessions = [
      // Tháng 10/2026 (Tháng trước - Mặc định hiển thị)
      {
        student_name: 'Em Hoàng - Toán 12',
        session_date: '2026-10-03',
        start_time: '18:00',
        end_time: '19:30',
        fee: 250000,
        notes: 'Chuyên đề: Cực trị hàm số chứa dấu giá trị tuyệt đối. Làm tốt bài tập 1-8.',
        is_paid: true,
      },
      {
        student_name: 'Minh Anh - IELTS Speaking',
        session_date: '2026-10-05',
        start_time: '19:30',
        end_time: '21:00',
        fee: 350000,
        notes: 'Luyện Part 2: Describe a challenging experience. Phát âm cần chú ý ending sounds.',
        is_paid: true,
      },
      {
        student_name: 'Em Hoàng - Toán 12',
        session_date: '2026-10-10',
        start_time: '18:00',
        end_time: '19:30',
        fee: 250000,
        notes: 'Tiếp tuyến của đồ thị hàm số và các dạng bài vận dụng cao.',
        is_paid: true,
      },
      {
        student_name: 'Bé Linh - Tiếng Anh Lớp 8',
        session_date: '2026-10-12',
        start_time: '17:30',
        end_time: '19:00',
        fee: 200000,
        notes: 'Ôn tập thì Hiện tại hoàn thành và Quá khứ đơn, giải đề kiểm tra giữa kỳ 1.',
        is_paid: true,
      },
      {
        student_name: 'Minh Anh - IELTS Speaking',
        session_date: '2026-10-14',
        start_time: '19:30',
        end_time: '21:00',
        fee: 350000,
        notes: 'Mock test Speaking full test band 6.5+. Từ vựng chủ đề Environment.',
        is_paid: true,
      },
      {
        student_name: 'Em Hoàng - Toán 12',
        session_date: '2026-10-17',
        start_time: '18:00',
        end_time: '19:30',
        fee: 250000,
        notes: 'Nguyên hàm từng phần và đổi biến số. Bài tập về nhà trang 45-48.',
        is_paid: false,
      },
      {
        student_name: 'Bé Linh - Tiếng Anh Lớp 8',
        session_date: '2026-10-19',
        start_time: '17:30',
        end_time: '19:00',
        fee: 200000,
        notes: 'Kỹ năng Đọc hiểu (Reading) Unit 4: Our Customs and Traditions.',
        is_paid: false,
      },
      {
        student_name: 'Em Hoàng - Toán 12',
        session_date: '2026-10-24',
        start_time: '18:00',
        end_time: '19:30',
        fee: 250000,
        notes: 'Tích phân hàm ẩn và ứng dụng hình học. Đã sửa hết bài kiểm tra.',
        is_paid: false,
      },
      {
        student_name: 'Minh Anh - IELTS Speaking',
        session_date: '2026-10-26',
        start_time: '19:30',
        end_time: '21:00',
        fee: 350000,
        notes: 'Luyện Part 3: In-depth discussion về Technology & Social media.',
        is_paid: false,
      },

      // Tháng 11/2026 (Tháng hiện tại)
      {
        student_name: 'Em Hoàng - Toán 12',
        session_date: '2026-11-01',
        start_time: '18:00',
        end_time: '19:30',
        fee: 250000,
        notes: 'Hình không gian Oxyz: Phương trình mặt phẳng và góc, khoảng cách.',
        is_paid: false,
      },
      {
        student_name: 'Bé Linh - Tiếng Anh Lớp 8',
        session_date: '2026-11-02',
        start_time: '17:30',
        end_time: '19:00',
        fee: 200000,
        notes: 'Luyện viết đoạn văn (Writing) Unit 5: Festivals in Viet Nam.',
        is_paid: false,
      },
    ];

    for (const item of sampleSessions) {
      await sql`
        INSERT INTO tutoring_sessions (
          student_name, session_date, start_time, end_time, fee, notes, is_paid
        )
        VALUES (
          ${item.student_name},
          ${item.session_date},
          ${item.start_time},
          ${item.end_time},
          ${item.fee},
          ${item.notes},
          ${item.is_paid}
        )
      `;
    }

    console.log(`Successfully seeded ${sampleSessions.length} sample tutoring sessions!`);
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seed();
