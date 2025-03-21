document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach(link => {
    if (link.hasAttribute("data-tab")) {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const tab = this.getAttribute("data-tab");
        
        document.querySelectorAll(".tab-content").forEach(section => {
          section.style.display = "none";
        });
        document.getElementById(tab).style.display = "block";

        if (tab === "student-management") {
          fetchStudentRegistrations();
        }
      });
    }
  });

  const courseForm = document.getElementById("course-form");
  const courseMsg = document.getElementById("course-msg");
  courseForm.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Course form submitted");

    const courseName = document.getElementById("course-name").value;
    const courseCode = document.getElementById("course-code").value;
    const courseSeats = document.getElementById("course-seats").value;
    const coursePrerequisites = document.getElementById("course-prerequisites").value;
    const department = document.getElementById("department").value;
    const courseLevel = document.getElementById("course-level").value;
    
    const data = {
      courseName,
      courseCode,
      seatsAvailable: courseSeats,
      prerequisites: coursePrerequisites,
      department,
      courseLevel
    };

    console.log("Data being sent:", data);
    
    fetch('/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log("Response:", result);
      courseMsg.textContent = result.message;
    })
    .catch(error => {
      console.error("Error:", error);
      courseMsg.textContent = "An error occurred while processing the request.";
    });
  });

  const deleteCourseForm = document.getElementById("delete-course-form");
  const deleteCourseMsg = document.getElementById("delete-course-msg");
  if (deleteCourseForm) {
    deleteCourseForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const courseCodeToDelete = document.getElementById("delete-course-code").value.trim();
      console.log("Deleting course:", courseCodeToDelete);
      
      fetch(`/admin/courses/code/${courseCodeToDelete}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(result => {
        console.log("Delete course response:", result);
        deleteCourseMsg.textContent = result.message;
      })
      .catch(error => {
        console.error("Delete course error:", error);
        deleteCourseMsg.textContent = "An error occurred while deleting the course.";
      });
    });
  }

  function fetchStudentRegistrations() {
    fetch('/admin/students')
      .then(response => response.json())
      .then(data => {
        const studentListDiv = document.getElementById("student-list");
        if (data.success) {
          if (data.students && data.students.length > 0) {
            let html = "<ul>";
            data.students.forEach(student => {
              html += `<li>${student.rollNumber} - ${student.name || 'No Name'}</li>`;
            });
            html += "</ul>";
            studentListDiv.innerHTML = html;
          } else {
            studentListDiv.innerHTML = "<p>No student registrations available.</p>";
          }
        } else {
          studentListDiv.innerHTML = `<p>${data.message}</p>`;
        }
      })
      .catch(err => {
        console.error("Error fetching student registrations:", err);
        const studentListDiv = document.getElementById("student-list");
        studentListDiv.innerHTML = "<p>Error fetching student registrations.</p>";
      });
  }

  const overrideForm = document.getElementById("override-form");
  if (overrideForm) {
    overrideForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const studentRoll = document.getElementById("student-roll").value;
      const overrideCourse = document.getElementById("override-course").value;
      console.log("Student Management Override:", studentRoll, overrideCourse);
    });
  }

  const seatForm = document.getElementById("seat-form");
  const seatMsg = document.getElementById("seat-msg");
  seatForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const seatCourseCode = document.getElementById("seat-course-code").value;
    const newSeats = document.getElementById("new-seats").value;
    console.log("Seat Management:", seatCourseCode, newSeats);
    
    fetch('/admin/courses/seats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseCode: seatCourseCode,
        newSeatCount: newSeats
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log("Seat update response:", result);
      seatMsg.textContent = result.message;
    })
    .catch(error => {
      console.error("Seat update error:", error);
      seatMsg.textContent = "An error occurred while updating seat count.";
    });
  });

  const reportStudentsButton = document.getElementById("report-students-course");
if (reportStudentsButton) {
  reportStudentsButton.addEventListener("click", function() {
    console.log("Generate report: Students registered for a course");
    const courseCode = prompt("Enter course code for report:");
    if (!courseCode) return;
    
    fetch(`/admin/reports/students?courseCode=${encodeURIComponent(courseCode)}`)
      .then(response => response.json())
      .then(data => {
        const reportResults = document.getElementById("report-results");
        if (data.success) {
          reportResults.innerHTML = `<pre>${JSON.stringify(data.report, null, 2)}</pre>`;
        } else {
          reportResults.innerHTML = `<p>${data.message}</p>`;
        }
      })
      .catch(err => {
        console.error("Error generating report:", err);
        document.getElementById("report-results").innerHTML = "<p>Error generating report.</p>";
      });
  });
}

const reportAvailableCoursesButton = document.getElementById("report-available-courses");
if (reportAvailableCoursesButton) {
  reportAvailableCoursesButton.addEventListener("click", function() {
    console.log("Generate report: Courses with available seats");
    
    fetch(`/admin/reports/available-courses`)
      .then(response => response.json())
      .then(data => {
        const reportResults = document.getElementById("report-results");
        if (data.success) {
          reportResults.innerHTML = `<pre>${JSON.stringify(data.report, null, 2)}</pre>`;
        } else {
          reportResults.innerHTML = `<p>${data.message}</p>`;
        }
      })
      .catch(err => {
        console.error("Error generating report:", err);
        document.getElementById("report-results").innerHTML = "<p>Error generating report.</p>";
      });
  });
}

const reportMissingPrereqButton = document.getElementById("report-missing-prereq");
if (reportMissingPrereqButton) {
  reportMissingPrereqButton.addEventListener("click", function() {
    console.log("Generate report: Students missing prerequisites");
    
    fetch(`/admin/reports/missing-prerequisites`)
      .then(response => response.json())
      .then(data => {
        const reportResults = document.getElementById("report-results");
        if (data.success) {
          reportResults.innerHTML = `<pre>${JSON.stringify(data.report, null, 2)}</pre>`;
        } else {
          reportResults.innerHTML = `<p>${data.message}</p>`;
        }
      })
      .catch(err => {
        console.error("Error generating report:", err);
        document.getElementById("report-results").innerHTML = "<p>Error generating report.</p>";
      });
  });
}
});
