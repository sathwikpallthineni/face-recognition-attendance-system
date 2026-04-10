# 🚀 Face Recognition-Based Attendance System

This project is a mini project that automates attendance using face recognition, reducing manual effort and enabling real-time monitoring.

---

## 🔧 System Overview

The system integrates hardware and software components. Facial data is captured using a camera (Raspberry Pi setup) and processed using OpenCV and DeepFace to generate facial encodings. These encodings are matched with stored data for identification.

A Node.js backend manages the application logic, and MongoDB Atlas is used for centralized data storage.

---

## 💻 Features

### 👨‍💼 Admin Module (Local)
- Register students with face data  
- Mark attendance using face recognition  
- Manage student records  

### 👨‍🎓 Student Dashboard (Deployed)
- Secure login access  
- View attendance records in real time  
- Attendance percentage tracking  

### ⚙️ System Features
- Face recognition using DeepFace  
- Real-time attendance marking  
- Attendance restricted to working days & time (9 AM – 11 AM)  
- Automated email notifications  
- Automatic absent marking  

---

## 🧱 Tech Stack

- **Frontend:** HTML, CSS, EJS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas  
- **Computer Vision:** OpenCV, DeepFace (Python)  
- **Integration:** Node.js child_process  

---

## 🔄 Workflow

1. Admin registers student with facial data  
2. Student face is captured and encoded  
3. During attendance, face is scanned and matched  
4. If matched → attendance marked  
5. Student logs in to view attendance dashboard  

---

## 🌐 Deployment

- Student Dashboard: Deployed (Railway)  
- Admin Module: Runs locally (camera-based operations)  

---

## 📸 Screenshots

---

## 📌 Key Learning

- Computer vision for face recognition  
- Cross-language integration (Node.js + Python)  
- Raspberry Pi setup and networking  
- Full-stack application development  

---

## ⚠️ Note

Student access is restricted to registered users only.

---

## 🔗 Links

- GitHub Repo: ()  
- Live Dashboard: (https://nmrec-student-attendance.up.railway.app)
