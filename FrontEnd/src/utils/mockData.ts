import { User, UserRole } from '../types/user';
import { Course, AudienceType } from '../types/course';
import { Survey, SurveyType } from '../types/survey';
import { Appointment, AppointmentStatus } from '../types/appointment';
import { Program, ProgramStatus, CommunityProgram } from '../types/program';
import { Consultant, ConsultantSpecialty } from '../types/consultant';
import { courseImages, programImages, consultantImages } from './imageUrls';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'guest@example.com',
    firstName: 'Guest',
    lastName: 'User',
    role: 'guest' as UserRole,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    email: 'member@example.com',
    firstName: 'Member',
    lastName: 'User',
    role: 'member' as UserRole,
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    email: 'staff@example.com',
    firstName: 'Staff',
    lastName: 'User',
    role: 'staff' as UserRole,
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
  {
    id: '4',
    email: 'consultant@example.com',
    firstName: 'Consultant',
    lastName: 'User',
    role: 'consultant' as UserRole,
    createdAt: new Date('2023-01-04'),
    updatedAt: new Date('2023-01-04'),
  },
  {
    id: '5',
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager' as UserRole,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
  },
  {
    id: '6',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as UserRole,
    createdAt: new Date('2023-01-06'),
    updatedAt: new Date('2023-01-06'),
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Nhận thức về ma túy cho học sinh',
    description: 'Khóa học giúp học sinh hiểu về tác hại của ma túy và cách phòng tránh.',
    audienceType: ['student'] as AudienceType[],
    duration: 60,
    thumbnail: courseImages[0],
    content: `
      <h2>Giới thiệu khóa học</h2>
      <p>Khóa học "Nhận thức về ma túy cho học sinh" được thiết kế đặc biệt để giúp các em học sinh hiểu rõ về tác hại của ma túy và các chất gây nghiện, đồng thời trang bị các kỹ năng cần thiết để phòng tránh.</p>

      <h2>Mục tiêu khóa học</h2>
      <ul>
        <li>Cung cấp kiến thức cơ bản về các loại ma túy phổ biến</li>
        <li>Giúp học sinh nhận biết tác hại của ma túy đối với sức khỏe và cuộc sống</li>
        <li>Trang bị kỹ năng nhận biết và từ chối ma túy</li>
        <li>Hướng dẫn cách tìm kiếm sự hỗ trợ khi cần thiết</li>
      </ul>

      <h2>Nội dung khóa học</h2>
      <p>Khóa học bao gồm 5 bài học, mỗi bài học kéo dài khoảng 12 phút, với các hoạt động tương tác và bài tập thực hành.</p>
    `,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
  },
  {
    id: '2',
    title: 'Kỹ năng từ chối ma túy',
    description: 'Khóa học dạy các kỹ năng từ chối khi bị mời sử dụng ma túy.',
    audienceType: ['student', 'general'] as AudienceType[],
    duration: 90,
    thumbnail: courseImages[1],
    content: `
      <h2>Giới thiệu khóa học</h2>
      <p>Khóa học "Kỹ năng từ chối ma túy" tập trung vào việc phát triển các kỹ năng thực tế giúp bạn tự tin từ chối khi bị mời sử dụng ma túy trong các tình huống khác nhau.</p>

      <h2>Mục tiêu khóa học</h2>
      <ul>
        <li>Phát triển kỹ năng giao tiếp tự tin và quyết đoán</li>
        <li>Học cách nhận diện các tình huống nguy hiểm</li>
        <li>Thực hành các phương pháp từ chối hiệu quả</li>
        <li>Xây dựng chiến lược ứng phó với áp lực từ bạn bè</li>
      </ul>

      <h2>Nội dung khóa học</h2>
      <p>Khóa học bao gồm 6 bài học, với nhiều tình huống mô phỏng và bài tập thực hành, giúp người học tự tin ứng phó trong mọi tình huống.</p>
    `,
    createdAt: new Date('2023-02-02'),
    updatedAt: new Date('2023-02-02'),
  },
  {
    id: '3',
    title: 'Hướng dẫn phụ huynh về phòng ngừa ma túy',
    description: 'Khóa học giúp phụ huynh hiểu và hỗ trợ con em phòng tránh ma túy.',
    audienceType: ['parent'] as AudienceType[],
    duration: 120,
    thumbnail: courseImages[2],
    content: `
      <h2>Giới thiệu khóa học</h2>
      <p>Khóa học "Hướng dẫn phụ huynh về phòng ngừa ma túy" cung cấp cho phụ huynh những kiến thức và kỹ năng cần thiết để hỗ trợ con em phòng tránh ma túy.</p>

      <h2>Mục tiêu khóa học</h2>
      <ul>
        <li>Hiểu rõ về các loại ma túy và dấu hiệu nhận biết khi con em sử dụng</li>
        <li>Học cách giao tiếp hiệu quả với con về vấn đề ma túy</li>
        <li>Xây dựng môi trường gia đình lành mạnh</li>
        <li>Biết cách can thiệp khi phát hiện con có nguy cơ</li>
      </ul>

      <h2>Nội dung khóa học</h2>
      <p>Khóa học bao gồm 8 bài học, với các nghiên cứu trường hợp thực tế và hướng dẫn cụ thể cho phụ huynh.</p>
    `,
    createdAt: new Date('2023-02-03'),
    updatedAt: new Date('2023-02-03'),
  },
  {
    id: '4',
    title: 'Kỹ năng giáo dục phòng chống ma túy',
    description: 'Khóa học dành cho giáo viên về cách giáo dục học sinh phòng chống ma túy.',
    audienceType: ['teacher'] as AudienceType[],
    duration: 150,
    thumbnail: courseImages[3],
    content: `
      <h2>Giới thiệu khóa học</h2>
      <p>Khóa học "Kỹ năng giáo dục phòng chống ma túy" được thiết kế đặc biệt cho giáo viên, cung cấp phương pháp và công cụ để giáo dục học sinh về phòng chống ma túy.</p>

      <h2>Mục tiêu khóa học</h2>
      <ul>
        <li>Cập nhật kiến thức về ma túy và xu hướng sử dụng trong giới trẻ</li>
        <li>Phát triển kỹ năng truyền đạt thông tin về ma túy một cách phù hợp</li>
        <li>Học cách tổ chức các hoạt động giáo dục phòng chống ma túy</li>
        <li>Xây dựng kế hoạch can thiệp và hỗ trợ học sinh có nguy cơ</li>
      </ul>

      <h2>Nội dung khóa học</h2>
      <p>Khóa học bao gồm 10 bài học, với nhiều tài liệu tham khảo và kế hoạch bài giảng mẫu cho giáo viên.</p>
    `,
    createdAt: new Date('2023-02-04'),
    updatedAt: new Date('2023-02-04'),
  },
  {
    id: '5',
    title: 'Phòng ngừa tái nghiện',
    description: 'Khóa học hỗ trợ người đã từng sử dụng ma túy phòng ngừa tái nghiện.',
    audienceType: ['general'] as AudienceType[],
    duration: 180,
    thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    content: `
      <h2>Giới thiệu khóa học</h2>
      <p>Khóa học "Phòng ngừa tái nghiện" cung cấp kiến thức và kỹ năng cho những người đã từng sử dụng ma túy, giúp họ xây dựng cuộc sống lành mạnh và phòng ngừa tái nghiện.</p>

      <h2>Mục tiêu khóa học</h2>
      <ul>
        <li>Hiểu rõ về cơ chế nghiện và tái nghiện</li>
        <li>Xây dựng kế hoạch phòng ngừa tái nghiện cá nhân</li>
        <li>Phát triển kỹ năng đối phó với cảm giác thèm nhớ</li>
        <li>Học cách xây dựng mạng lưới hỗ trợ</li>
      </ul>

      <h2>Nội dung khóa học</h2>
      <p>Khóa học bao gồm 12 bài học, với các bài tập thực hành và hướng dẫn cụ thể cho từng giai đoạn phục hồi.</p>
    `,
    createdAt: new Date('2023-02-05'),
    updatedAt: new Date('2023-02-05'),
  },
  {
    id: '6',
    title: 'Hỗ trợ người thân của người nghiện',
    description: 'Khóa học dành cho người thân của người nghiện ma túy, giúp họ hiểu và hỗ trợ hiệu quả.',
    audienceType: ['general'] as AudienceType[],
    duration: 120,
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    content: `
      <h2>Giới thiệu khóa học</h2>
      <p>Khóa học "Hỗ trợ người thân của người nghiện" cung cấp kiến thức và kỹ năng cho người thân của người nghiện ma túy, giúp họ hiểu và hỗ trợ người thân một cách hiệu quả.</p>

      <h2>Mục tiêu khóa học</h2>
      <ul>
        <li>Hiểu rõ về bệnh nghiện và quá trình phục hồi</li>
        <li>Học cách thiết lập ranh giới lành mạnh</li>
        <li>Phát triển kỹ năng giao tiếp hiệu quả với người nghiện</li>
        <li>Tìm hiểu các nguồn hỗ trợ cho gia đình</li>
      </ul>

      <h2>Nội dung khóa học</h2>
      <p>Khóa học bao gồm 8 bài học, với các nghiên cứu trường hợp và hướng dẫn cụ thể cho từng tình huống.</p>
    `,
    createdAt: new Date('2023-02-06'),
    updatedAt: new Date('2023-02-06'),
  },
];

// Mock Surveys
export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Khảo sát ASSIST',
    description: 'Đánh giá mức độ nguy cơ sử dụng ma túy theo phương pháp ASSIST.',
    type: 'ASSIST' as SurveyType,
    questions: [
      {
        id: '1',
        text: 'Bạn đã từng sử dụng ma túy chưa?',
        options: ['Chưa bao giờ', 'Đã từng thử', 'Thỉnh thoảng', 'Thường xuyên'],
        scores: [0, 1, 2, 3],
      },
      {
        id: '2',
        text: 'Bạn có thường xuyên nghĩ đến việc sử dụng ma túy không?',
        options: ['Không bao giờ', 'Hiếm khi', 'Thỉnh thoảng', 'Thường xuyên'],
        scores: [0, 1, 2, 3],
      },
    ],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01'),
  },
  {
    id: '2',
    title: 'Khảo sát CRAFFT',
    description: 'Đánh giá mức độ nguy cơ sử dụng ma túy theo phương pháp CRAFFT.',
    type: 'CRAFFT' as SurveyType,
    questions: [
      {
        id: '1',
        text: 'Bạn đã từng đi xe do người đã sử dụng ma túy lái?',
        options: ['Không', 'Có'],
        scores: [0, 1],
      },
      {
        id: '2',
        text: 'Bạn có sử dụng ma túy để thư giãn không?',
        options: ['Không', 'Có'],
        scores: [0, 1],
      },
    ],
    createdAt: new Date('2023-03-02'),
    updatedAt: new Date('2023-03-02'),
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    userId: '2',
    consultantId: '4',
    date: new Date('2023-05-15'),
    duration: 60,
    status: 'pending' as AppointmentStatus,
    createdAt: new Date('2023-04-01'),
    // Client-side properties
    startTime: '09:00',
    endTime: '10:00',
    updatedAt: new Date('2023-04-01'),
  },
  {
    id: '2',
    userId: '2',
    consultantId: '4',
    date: new Date('2023-05-20'),
    duration: 60,
    status: 'completed' as AppointmentStatus,
    notes: 'Buổi tư vấn đầu tiên, cần theo dõi tiếp.',
    createdAt: new Date('2023-04-02'),
    // Client-side properties
    startTime: '14:00',
    endTime: '15:00',
    updatedAt: new Date('2023-05-20'),
  },
  {
    id: '3',
    userId: '3',
    consultantId: '1',
    date: new Date('2023-06-10'),
    duration: 90,
    status: 'confirmed' as AppointmentStatus,
    createdAt: new Date('2023-05-15'),
    // Client-side properties
    startTime: '10:30',
    endTime: '12:00',
    updatedAt: new Date('2023-05-15'),
  },
  {
    id: '4',
    userId: '5',
    consultantId: '2',
    date: new Date('2023-06-15'),
    duration: 45,
    status: 'cancelled' as AppointmentStatus,
    notes: 'Hủy do lịch bận đột xuất',
    createdAt: new Date('2023-05-20'),
    // Client-side properties
    startTime: '15:30',
    endTime: '16:15',
    updatedAt: new Date('2023-05-25'),
  },
  {
    id: '5',
    userId: '3',
    consultantId: '3',
    date: new Date('2023-06-20'),
    duration: 60,
    status: 'scheduled' as AppointmentStatus,
    createdAt: new Date('2023-05-25'),
    // Client-side properties
    startTime: '11:00',
    endTime: '12:00',
    updatedAt: new Date('2023-05-25'),
  },
];

// Mock Programs for Admin
export const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'Ngày hội phòng chống ma túy',
    description: 'Chương trình nâng cao nhận thức về phòng chống ma túy trong cộng đồng, với nhiều hoạt động tương tác, triển lãm và tư vấn trực tiếp từ các chuyên gia.',
    location: 'Trung tâm Văn hóa Thanh niên, 04 Phạm Ngọc Thạch, Quận 1',
    date: new Date('2023-06-26'),
    duration: 480, // 8 hours
    capacity: 200,
    registrations: 150,
    status: 'upcoming' as ProgramStatus,
    image: programImages[0],
    createdAt: new Date('2023-05-01'),
    // Client-side properties
    startDate: new Date('2023-06-26'),
    endDate: new Date('2023-06-26T08:00:00'),
    registeredCount: 150,
    updatedAt: new Date('2023-05-01'),
  },
  {
    id: '2',
    title: 'Hội thảo kỹ năng sống cho học sinh',
    description: 'Hội thảo trang bị kỹ năng sống và phòng tránh ma túy cho học sinh THPT, với sự tham gia của các chuyên gia tâm lý và giáo dục.',
    location: 'Trường THPT Nguyễn Du, 12 Nguyễn Văn Cừ, Quận 5',
    date: new Date('2023-07-15'),
    duration: 240, // 4 hours
    capacity: 100,
    registrations: 80,
    status: 'upcoming' as ProgramStatus,
    image: programImages[1],
    createdAt: new Date('2023-05-02'),
    // Client-side properties
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-07-15T04:00:00'),
    registeredCount: 80,
    updatedAt: new Date('2023-05-02'),
  },
  {
    id: '3',
    title: 'Tọa đàm "Gia đình và phòng chống ma túy"',
    description: 'Chương trình tọa đàm về vai trò của gia đình trong việc phòng chống ma túy, với sự tham gia của các chuyên gia và chia sẻ từ các gia đình có kinh nghiệm.',
    location: 'Hội trường Thành Đoàn, 01 Phạm Ngọc Thạch, Quận 1',
    date: new Date('2023-08-05'),
    duration: 180, // 3 hours
    capacity: 150,
    registrations: 30,
    status: 'upcoming' as ProgramStatus,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: new Date('2023-05-03'),
    // Client-side properties
    startDate: new Date('2023-08-05'),
    endDate: new Date('2023-08-05T03:00:00'),
    registeredCount: 30,
    updatedAt: new Date('2023-05-03'),
  },
  {
    id: '4',
    title: 'Chương trình đào tạo tình nguyện viên',
    description: 'Chương trình đào tạo tình nguyện viên tham gia các hoạt động phòng chống ma túy trong cộng đồng, với các kỹ năng truyền thông, tư vấn cơ bản và tổ chức sự kiện.',
    location: 'Trung tâm Hỗ trợ Thanh niên, 05 Đinh Tiên Hoàng, Quận 1',
    date: new Date('2023-05-12'),
    duration: 960, // 16 hours (2 days)
    capacity: 50,
    registrations: 50,
    status: 'completed' as ProgramStatus,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: new Date('2023-04-01'),
    // Client-side properties
    startDate: new Date('2023-05-12'),
    endDate: new Date('2023-05-14'),
    registeredCount: 50,
    updatedAt: new Date('2023-04-01'),
  },
  {
    id: '5',
    title: 'Hội thảo "Phòng chống ma túy trong trường học"',
    description: 'Hội thảo dành cho giáo viên và cán bộ quản lý giáo dục về các biện pháp phòng chống ma túy trong trường học.',
    location: 'Sở Giáo dục và Đào tạo TP.HCM, 66-68 Lê Thánh Tôn, Quận 1',
    date: new Date('2023-06-05'),
    duration: 300, // 5 hours
    capacity: 80,
    registrations: 75,
    status: 'ongoing' as ProgramStatus,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: new Date('2023-05-10'),
    // Client-side properties
    startDate: new Date('2023-06-05'),
    endDate: new Date('2023-06-05T05:00:00'),
    registeredCount: 75,
    updatedAt: new Date('2023-05-10'),
  },
];

// Mock Community Programs
export const mockCommunityPrograms: CommunityProgram[] = [
  {
    id: '1',
    title: 'Ngày hội phòng chống ma túy',
    description: 'Chương trình nâng cao nhận thức về phòng chống ma túy trong cộng đồng, với nhiều hoạt động tương tác, triển lãm và tư vấn trực tiếp từ các chuyên gia.',
    location: 'Trung tâm Văn hóa Thanh niên, 04 Phạm Ngọc Thạch, Quận 1',
    startDate: new Date('2023-06-26'),
    endDate: new Date('2023-06-26'),
    capacity: 200,
    registeredCount: 150,
    image: programImages[0],
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-01'),
  },
  {
    id: '2',
    title: 'Hội thảo kỹ năng sống cho học sinh',
    description: 'Hội thảo trang bị kỹ năng sống và phòng tránh ma túy cho học sinh THPT, với sự tham gia của các chuyên gia tâm lý và giáo dục.',
    location: 'Trường THPT Nguyễn Du, 12 Nguyễn Văn Cừ, Quận 5',
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-07-15'),
    capacity: 100,
    registeredCount: 80,
    image: programImages[1],
    createdAt: new Date('2023-05-02'),
    updatedAt: new Date('2023-05-02'),
  },
  {
    id: '3',
    title: 'Tọa đàm "Gia đình và phòng chống ma túy"',
    description: 'Chương trình tọa đàm về vai trò của gia đình trong việc phòng chống ma túy, với sự tham gia của các chuyên gia và chia sẻ từ các gia đình có kinh nghiệm.',
    location: 'Hội trường Thành Đoàn, 01 Phạm Ngọc Thạch, Quận 1',
    startDate: new Date('2023-08-05'),
    endDate: new Date('2023-08-05'),
    capacity: 150,
    registeredCount: 30,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: new Date('2023-05-03'),
    updatedAt: new Date('2023-05-03'),
  },
  {
    id: '4',
    title: 'Chương trình đào tạo tình nguyện viên',
    description: 'Chương trình đào tạo tình nguyện viên tham gia các hoạt động phòng chống ma túy trong cộng đồng, với các kỹ năng truyền thông, tư vấn cơ bản và tổ chức sự kiện.',
    location: 'Trung tâm Hỗ trợ Thanh niên, 05 Đinh Tiên Hoàng, Quận 1',
    startDate: new Date('2023-08-12'),
    endDate: new Date('2023-08-13'),
    capacity: 50,
    registeredCount: 20,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    createdAt: new Date('2023-05-04'),
    updatedAt: new Date('2023-05-04'),
  },
];

// Mock Consultants for Admin
export const mockConsultants: Consultant[] = [
  {
    id: '1',
    name: 'Nguyễn Minh',
    title: 'Tiến sĩ Tâm lý học',
    specialty: ['youth', 'addiction'] as ConsultantSpecialty[],
    bio: 'Tiến sĩ Nguyễn Minh có hơn 8 năm kinh nghiệm trong lĩnh vực tư vấn tâm lý và phòng chống nghiện cho thanh thiếu niên. Ông đã tham gia nhiều dự án nghiên cứu và phát triển các chương trình can thiệp hiệu quả.',
    email: 'minh.nguyen@example.com',
    phone: '0901234567',
    avatar: consultantImages[0],
    rating: 4.8,
    availability: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: '2',
    name: 'Trần Hương',
    title: 'Thạc sĩ Công tác xã hội',
    specialty: ['family', 'mental_health'] as ConsultantSpecialty[],
    bio: 'Thạc sĩ Trần Hương chuyên về tư vấn và hỗ trợ gia đình có thành viên gặp vấn đề về sử dụng chất gây nghiện. Cô có kinh nghiệm làm việc với nhiều gia đình và phát triển các chiến lược hỗ trợ hiệu quả.',
    email: 'huong.tran@example.com',
    phone: '0912345678',
    avatar: consultantImages[1],
    rating: 4.9,
    availability: true,
    createdAt: new Date('2022-02-01'),
  },
  {
    id: '3',
    name: 'Phạm Tuấn',
    title: 'Bác sĩ Tâm thần học',
    specialty: ['addiction', 'mental_health'] as ConsultantSpecialty[],
    bio: 'Bác sĩ Phạm Tuấn là chuyên gia trong lĩnh vực tâm thần học và nghiện chất, với hơn 10 năm kinh nghiệm. Ông đã giúp đỡ nhiều người vượt qua giai đoạn khó khăn và xây dựng cuộc sống lành mạnh.',
    email: 'tuan.pham@example.com',
    phone: '0923456789',
    avatar: consultantImages[2],
    rating: 4.7,
    availability: true,
    createdAt: new Date('2022-03-01'),
  },
  {
    id: '4',
    name: 'Đỗ Linh',
    title: 'Thạc sĩ Tâm lý học Giáo dục',
    specialty: ['education', 'youth'] as ConsultantSpecialty[],
    bio: 'Thạc sĩ Đỗ Linh chuyên về tư vấn học đường và phát triển kỹ năng sống cho học sinh, sinh viên. Cô có nhiều kinh nghiệm trong việc tổ chức các chương trình giáo dục phòng chống ma túy trong trường học.',
    email: 'linh.do@example.com',
    phone: '0934567890',
    avatar: consultantImages[3],
    rating: 4.6,
    availability: false,
    createdAt: new Date('2022-04-01'),
  },
  {
    id: '5',
    name: 'Lê Hùng',
    title: 'Chuyên gia Tư vấn Tâm lý',
    specialty: ['addiction', 'family'] as ConsultantSpecialty[],
    bio: 'Chuyên gia Lê Hùng có hơn 15 năm kinh nghiệm trong lĩnh vực tư vấn tâm lý và hỗ trợ người nghiện. Ông đã phát triển nhiều phương pháp điều trị hiệu quả và được nhiều người tin tưởng.',
    email: 'hung.le@example.com',
    phone: '0945678901',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    rating: 4.9,
    availability: true,
    createdAt: new Date('2022-05-01'),
  },
];

// Mock Consultant Details
export const mockConsultantDetails = [
  {
    id: '1',
    userId: '4',
    firstName: 'Minh',
    lastName: 'Nguyễn',
    email: 'minh.nguyen@example.com',
    phoneNumber: '0901234567',
    specialization: ['Tư vấn thanh thiếu niên', 'Phòng chống nghiện'],
    education: 'Tiến sĩ Tâm lý học, Đại học Y Hà Nội',
    experience: 8,
    bio: 'Tiến sĩ Minh Nguyễn có hơn 8 năm kinh nghiệm trong lĩnh vực tư vấn tâm lý và phòng chống nghiện cho thanh thiếu niên. Ông đã tham gia nhiều dự án nghiên cứu và phát triển các chương trình can thiệp hiệu quả.',
    profilePicture: consultantImages[0],
    availableDays: [1, 2, 3, 4, 5], // Monday to Friday
    availableHours: {
      start: '09:00',
      end: '17:00',
    },
    rating: 4.8,
    reviewCount: 45,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01'),
  },
  {
    id: '2',
    userId: '',
    firstName: 'Hương',
    lastName: 'Trần',
    email: 'huong.tran@example.com',
    phoneNumber: '0912345678',
    specialization: ['Tư vấn gia đình', 'Hỗ trợ người thân'],
    education: 'Thạc sĩ Công tác xã hội, Đại học Khoa học Xã hội và Nhân văn',
    experience: 5,
    bio: 'Thạc sĩ Hương Trần chuyên về tư vấn và hỗ trợ gia đình có thành viên gặp vấn đề về sử dụng chất gây nghiện. Cô có kinh nghiệm làm việc với nhiều gia đình và phát triển các chiến lược hỗ trợ hiệu quả.',
    profilePicture: consultantImages[1],
    availableDays: [1, 3, 5, 6], // Monday, Wednesday, Friday, Saturday
    availableHours: {
      start: '13:00',
      end: '20:00',
    },
    rating: 4.9,
    reviewCount: 37,
    createdAt: new Date('2022-02-01'),
    updatedAt: new Date('2022-02-01'),
  },
];

// Extend consultants with client-side properties
mockConsultants.forEach(consultant => {
  const details = mockConsultantDetails.find(c => c.id === consultant.id);
  if (details) {
    consultant.firstName = details.firstName;
    consultant.lastName = details.lastName;
    consultant.profilePicture = details.profilePicture;
    consultant.specialization = details.specialization;
    consultant.education = details.education;
    consultant.experience = details.experience;
    consultant.reviewCount = details.reviewCount;
    consultant.phoneNumber = details.phoneNumber;
    consultant.availableDays = details.availableDays;
    consultant.availableHours = details.availableHours;
  }
});