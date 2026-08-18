async function test() {
  try {
    const baseUrl = 'http://localhost:5000';
    
    // 1. Admin login
    const adminRes = await fetch(`${baseUrl}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@invigio.com', password: 'password123' })
    });
    const adminData = await adminRes.json();
    const adminToken = adminData.token;
    console.log("Admin logged in. Token:", !!adminToken);
    
    // 2. Professor login
    const profRes = await fetch(`${baseUrl}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'professor@invigio.com', password: 'password123' })
    });
    const profData = await profRes.json();
    const profToken = profData.token;
    console.log("Professor logged in. Token:", !!profToken);

    // 3. Create Exam
    const examRes = await fetch(`${baseUrl}/api/exams`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        subjectName: "Test Subject",
        subjectCode: "TST101",
        department: "INFT",
        semester: 3,
        academicYear: "2024-2025",
        branch: ["INFT"],
        examDate: new Date().toISOString(),
        startTime: "10:00",
        endTime: "13:00"
      })
    });
    const examData = await examRes.json();
    const examId = examData.exam._id;
    console.log("Exam created:", examId);

    // 4. Professor volunteers
    const volunteerRes = await fetch(`${baseUrl}/api/exams/${examId}/volunteer`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${profToken}`
      }
    });
    const volunteerData = await volunteerRes.json();
    console.log("Professor volunteered:", volunteerData);

    // 5. Admin checks notifications
    const notifsRes = await fetch(`${baseUrl}/api/notifications`, {
      headers: { 
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const notifsData = await notifsRes.json();
    console.log("Admin Notifications:", JSON.stringify(notifsData.notifications, null, 2));

  } catch (error) {
    console.error("Error:", error);
  }
}

test();
