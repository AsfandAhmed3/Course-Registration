document.addEventListener("DOMContentLoaded", function() {
  console.log("Student dashboard loaded");
  
  const filterForm = document.getElementById("filter-form");
  const filterResults = document.getElementById("filter-results");
  const prerequisiteContainer = document.getElementById("prerequisites");

  updateWeeklyCalendar();

  filterForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const department = document.getElementById("department").value;
    const courseLevel = document.getElementById("course-level")?.value || "";
    const timeOfDay = document.getElementById("time-of-day")?.value || "";
    const days = document.getElementById("days")?.value || "";
    const openSeats = document.getElementById("open-seats")?.value || "";

    const queryParams = new URLSearchParams({
      department,
      courseLevel,
      timeOfDay,
      days,
      openSeats
    });
    
    fetch(`/student/courses?${queryParams.toString()}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          displayCourses(data.courses);
        } else {
          filterResults.innerHTML = "<p>Error fetching courses.</p>";
        }
      })
      .catch(err => {
        console.error("Error filtering courses:", err);
        filterResults.innerHTML = "<p>Error fetching courses.</p>";
      });
  });
  
  function displayCourses(courses) {
    filterResults.innerHTML = "";
    if (!courses || courses.length === 0) {
      filterResults.innerHTML = "<p>No courses found.</p>";
      return;
    }
    
    const ul = document.createElement("ul");
    courses.forEach(course => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${course.courseCode}</strong> - ${course.courseName} (${course.seatsAvailable} seats)
        <br>Prerequisites: ${course.prerequisites && course.prerequisites.length ? course.prerequisites.join(", ") : "None"}
        <button class="register-btn" data-courseid="${course._id}">Register</button>
      `;
      ul.appendChild(li);
    });
    filterResults.appendChild(ul);
    
    document.querySelectorAll(".register-btn").forEach(button => {
      button.addEventListener("click", function() {
        const courseId = this.getAttribute("data-courseid");
        registerCourse(courseId);
      });
    });
  }
  
  function registerCourse(courseId) {
    fetch('/student/schedule/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId })
    })
    .then(response => response.json())
    .then(result => {
      console.log("Register course response:", result);
      if (result.success) {
        alert("Course registered successfully!");
        updateWeeklyCalendar();
      } else {
        alert(result.message);
      }
    })
    .catch(err => {
      console.error("Error registering course:", err);
      alert("An error occurred during registration.");
    });
  }

  function updateWeeklyCalendar() {
    clearCalendarCells();

    fetch('/student/schedule/json')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.schedule) {
          fillCalendarCells(data.schedule);
        } else {
          console.error("Error fetching schedule:", data.message);
        }
      })
      .catch(err => {
        console.error("Error updating timetable:", err);
      });
  }

  function clearCalendarCells() {
    const cells = document.querySelectorAll('#calendar-section td[data-day][data-time]');
    cells.forEach(cell => {
      cell.textContent = "";
    });
  }

  function fillCalendarCells(registeredCourses) {
    registeredCourses.forEach(course => {
      if (course.schedule && course.schedule.length > 0) {
        course.schedule.forEach(slot => {
          const dayAbbrev = dayToAbbrev(slot.day);
          
          const startHour = parseInt(slot.startTime.split(':')[0], 10);
          const endHour = parseInt(slot.endTime.split(':')[0], 10);

          for (let hour = startHour; hour < endHour; hour++) {
            const cell = document.querySelector(`#calendar-section td[data-day="${dayAbbrev}"][data-time="${hour}"]`);
            if (cell) {
              cell.textContent = course.courseCode;
            }
          }
        });
      }
    });
  }

  function dayToAbbrev(day) {
    switch(day.toLowerCase()) {
      case 'monday': return 'mon';
      case 'tuesday': return 'tue';
      case 'wednesday': return 'wed';
      case 'thursday': return 'thu';
      case 'friday': return 'fri';
      default: return '';
    }
  }
});
