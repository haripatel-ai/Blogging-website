// =========================================================================
// Student Blog Project - JavaScript Logic
// Built using vanilla JavaScript and LocalStorage
// =========================================================================

// Initial sample posts to display if local storage is empty
const defaultPosts = [
  {
    id: 1,
    title: "My Journey Learning Web Development",
    author: "Rahul Sharma",
    category: "Coding",
    date: "Sep 20, 2026",
    content: "When I first started learning HTML and CSS, everything felt a bit overwhelming. But once I built my first small project and understood how JavaScript brings web pages to life, it became really exciting! Practice and building small things every week is the best way to learn."
  },
  {
    id: 2,
    title: "Top 5 Study Habits for College Exams",
    author: "Priya Patel",
    category: "Study Tips",
    date: "Sep 22, 2026",
    content: "1. Follow the Pomodoro technique (25 min study, 5 min break).\n2. Make handwritten summary notes before exams.\n3. Solve previous years' question papers.\n4. Avoid multitasking with your phone.\n5. Get at least 7 hours of sleep before exam day."
  },
  {
    id: 3,
    title: "Why Every Student Should Learn Git and GitHub",
    author: "Aman Verma",
    category: "Technology",
    date: "Sep 25, 2026",
    content: "Git is an essential tool for every programmer. It allows you to track changes in your code, collaborate smoothly on team projects, and maintain a backup of your work. Having active GitHub repositories also greatly helps your resume when applying for internships."
  }
];

// Load posts from localStorage, or use defaultPosts if nothing is saved
let posts = JSON.parse(localStorage.getItem("myBlogPosts")) || defaultPosts;

// Track the currently active category filter
let currentCategory = "All";

// DOM Elements
const blogForm = document.getElementById("blogForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const categorySelect = document.getElementById("category");
const contentInput = document.getElementById("content");
const postsList = document.getElementById("postsList");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".filter-btn");
const noPostsMessage = document.getElementById("noPostsMessage");

// -------------------------------------------------------------------------
// Function: Save posts array to browser's LocalStorage
// -------------------------------------------------------------------------
function savePostsToStorage() {
  localStorage.setItem("myBlogPosts", JSON.stringify(posts));
}

// -------------------------------------------------------------------------
// Function: Render blog posts onto the web page
// -------------------------------------------------------------------------
function displayPosts(postsToDisplay) {
  // Clear the existing list
  postsList.innerHTML = "";

  // Show "no posts" message if empty
  if (postsToDisplay.length === 0) {
    noPostsMessage.style.display = "block";
    return;
  } else {
    noPostsMessage.style.display = "none";
  }

  // Loop through each post and create an HTML card
  postsToDisplay.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";

    // Prepare shortened preview if content is long
    const isLong = post.content.length > 180;
    const shortText = isLong ? post.content.substring(0, 180) + "..." : post.content;

    card.innerHTML = `
      <div class="post-header">
        <h3 class="post-title">${post.title}</h3>
        <span class="category-badge">${post.category}</span>
      </div>
      <p class="post-meta">By <strong>${post.author}</strong> on ${post.date}</p>
      <div class="post-content" id="content-${post.id}">${shortText}</div>
      <div class="post-footer">
        ${isLong ? `<button class="btn-read-more" onclick="toggleReadMore(${post.id})">Read More</button>` : '<span></span>'}
        <button class="btn-delete" onclick="deletePost(${post.id})">Delete</button>
      </div>
    `;

    postsList.appendChild(card);
  });
}

// -------------------------------------------------------------------------
// Function: Toggle between short preview and full post content
// -------------------------------------------------------------------------
function toggleReadMore(postId) {
  const post = posts.find((p) => p.id === postId);
  const contentElement = document.getElementById(`content-${postId}`);
  const button = event.target;

  if (button.innerText === "Read More") {
    contentElement.innerText = post.content;
    button.innerText = "Read Less";
  } else {
    contentElement.innerText = post.content.substring(0, 180) + "...";
    button.innerText = "Read More";
  }
}

// -------------------------------------------------------------------------
// Function: Add a new blog post from the form
// -------------------------------------------------------------------------
blogForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page reload

  // Format today's date (e.g. Sep 26, 2026)
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Create new post object
  const newPost = {
    id: Date.now(), // Unique ID using timestamp
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    category: categorySelect.value,
    date: today,
    content: contentInput.value.trim()
  };

  // Add new post to the top of our array
  posts.unshift(newPost);

  // Save to localStorage
  savePostsToStorage();

  // Reset form inputs
  blogForm.reset();

  // Re-display updated posts
  filterPosts();

  alert("Your blog post has been published successfully!");
});

// -------------------------------------------------------------------------
// Function: Delete a post by ID
// -------------------------------------------------------------------------
function deletePost(postId) {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (confirmDelete) {
    posts = posts.filter((p) => p.id !== postId);
    savePostsToStorage();
    filterPosts();
  }
}

// -------------------------------------------------------------------------
// Function: Filter posts based on active category and search input
// -------------------------------------------------------------------------
function filterPosts() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filtered = posts.filter((post) => {
    // Check category match
    const matchesCategory =
      currentCategory === "All" || post.category.toLowerCase() === currentCategory.toLowerCase();

    // Check search keyword match in title, content, or author
    const matchesSearch =
      post.title.toLowerCase().includes(searchText) ||
      post.content.toLowerCase().includes(searchText) ||
      post.author.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  displayPosts(filtered);
}

// Search input event
searchInput.addEventListener("input", filterPosts);

// Category filter buttons event
categoryButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Remove active class from all buttons
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    this.classList.add("active");

    currentCategory = this.dataset.category;
    filterPosts();
  });
});

// Initial display when page loads
displayPosts(posts);
