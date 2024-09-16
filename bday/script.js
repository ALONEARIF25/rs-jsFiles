// Utility to calculate the difference in days
const calculateDaysDifference = (birthday) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Extract month and day from dob
  const birthDate = new Date(
    `${currentYear}-${birthday.getMonth() + 1}-${birthday.getDate()}`
  );
  const timeDiff = birthDate - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

// Function to generate imageCon HTML
const generateImageCon = (member, daysDiff) => {
  const imgSrc = member.image ? `../${member.image}` : "../images/user.jpg";
  const memberName = member.name;
  const timeLabel =
    daysDiff === 0
      ? "Today"
      : daysDiff > 0
      ? `${daysDiff} days left`
      : `${Math.abs(daysDiff)} days ago`;

  // Create HTML for member
  return `
        <div class="imageCon" style="border-color: ${member.border_color}; box-shadow: ${member.border_shadow};">
          <div class="image">
            <img src="${imgSrc}" alt="${memberName}'s image" class="userimage">
            <p class="i-text-name">${memberName}</p>
            <p class="i-text">${timeLabel}</p>
          </div>
        </div>`;
};

// Get birthdays happening today
const getTodayBirthdays = () => {
  const today = new Date();
  return teamMembers.filter((member) => {
    const dob = new Date(member.dob);
    return (
      dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth()
    );
  });
};

// Get upcoming birthdays within the next 30 days
const getUpcomingBirthdays = () => {
  return teamMembers
    .map((member) => {
      const dob = new Date(member.dob);
      const daysDiff = calculateDaysDifference(dob);
      return { ...member, daysDiff };
    })
    .filter((member) => member.daysDiff > 0 && member.daysDiff <= 30)
    .sort((a, b) => a.daysDiff - b.daysDiff);
};

// Get recent birthdays within the past 30 days
const getRecentBirthdays = () => {
  return teamMembers
    .map((member) => {
      const dob = new Date(member.dob);
      const daysDiff = calculateDaysDifference(dob);
      return { ...member, daysDiff };
    })
    .filter((member) => member.daysDiff < 0 && Math.abs(member.daysDiff) <= 30)
    .sort((a, b) => Math.abs(a.daysDiff) - Math.abs(b.daysDiff));
};

// Render birthdays for a specific container
const renderBirthdays = (container, members, notFoundMessage) => {
  if (members.length === 0) {
    container.innerHTML = `<p class="not-found">${notFoundMessage}</p>`;
  } else {
    container.innerHTML = members
      .map((member) => generateImageCon(member, member.daysDiff || 0))
      .join("");
  }
};

// Render the birthday containers
const renderAllBirthdays = () => {
  const todayContainer = document.querySelector(".today-container");
  const upcomingContainer = document.querySelector(".upcoming-container");
  const recentContainer = document.querySelector(".recent-container");

  const todayMembers = getTodayBirthdays();
  const upcomingMembers = getUpcomingBirthdays();
  const recentMembers = getRecentBirthdays();

  // Render today, upcoming, and recent birthdays
  renderBirthdays(todayContainer, todayMembers, "No birthdays today");
  renderBirthdays(upcomingContainer, upcomingMembers, "No upcoming birthdays");
  renderBirthdays(recentContainer, recentMembers, "No recent birthdays");
};

// Initialize rendering when the page loads
document.addEventListener("DOMContentLoaded", renderAllBirthdays);

document.addEventListener("DOMContentLoaded", () => {
  const scrollContainers = document.querySelectorAll(".scroll-container");

  scrollContainers.forEach((container) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener("mousedown", (e) => {
      isDown = true;
      container.classList.add("active");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener("mouseleave", () => {
      isDown = false;
      container.classList.remove("active");
    });

    container.addEventListener("mouseup", () => {
      isDown = false;
      container.classList.remove("active");
    });

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 3; // Adjust scroll speed
      container.scrollLeft = scrollLeft - walk;
    });

    // Prevent default image dragging
    container.addEventListener("dragstart", (e) => e.preventDefault());
  });
});

const menuIcon = document.querySelector(".menu-icon");
const body = document.body;
const sidebar = document.querySelector(".sidebar");

// Toggle sidebar visibility on menu icon click
menuIcon.addEventListener("click", () => {
  body.classList.toggle("sidebar-active");
});

// Close the sidebar when clicking outside
window.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
    body.classList.remove("sidebar-active");
  }
});
