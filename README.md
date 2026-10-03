# GDG Project Showcase & Feedback Board

A community project board built for the GDG recruitment task.

Users can submit projects, discover projects shared by the community, search and filter projects, upvote projects, and leave short feedback.

## Live Demo

> To be added after deployment.

## GitHub Repository

> To be added after the GitHub repository is created.

---

## Features

### Project Submission

Users can submit:

- Project title
- Project description
- Technology tags
- GitHub or demo link

### Project Feed

All submitted projects are displayed as responsive project cards.

### Search

Users can search projects by:

- Project title
- Description
- Technology tags

### Tag Filtering

Projects can be filtered using tags such as:

- Web
- AI
- Mobile

### Upvotes

Users can upvote projects.

Each authenticated user can upvote the same project only once.

### Feedback

Users can leave short comments on projects.

### Shared Database

Project data, comments, and upvotes are stored in Supabase so users can see shared community data.

### Anonymous Authentication

The application uses Supabase anonymous authentication so users can interact with the board without creating a traditional account.

### Responsive Design

The interface is designed to work on both desktop and mobile screens.

### Security

User-generated project text and comments are safely escaped before being rendered.

Project links are limited to HTTP and HTTPS URLs.

---

## Tech Stack

- HTML
- CSS
- JavaScript
- Supabase
- PostgreSQL
- Supabase Anonymous Authentication

---

## Project Structure

```text
GDG-Recruitment/
│
├── AUDIT.md
├── README.md
├── evidence/
│
└── project-showcase/
    ├── index.html
    ├── style.css
    ├── script.js
    └── supabase-config.js
```

---

## Running the Project Locally

This project is a frontend application connected to Supabase.

### 1. Open the project

Open the `project-showcase` folder.

### 2. Configure Supabase

Open:

```text
supabase-config.js
```

Make sure your Supabase project URL and publishable key are present.

Do not use a Supabase secret key or service-role key in frontend code.

### 3. Start the website

Use a local development server to open `index.html`.

In VS Code, the Live Server extension can be used to start the website.

### 4. Use the application

The browser will open the Project Showcase application.

The application connects to Supabase and loads the shared projects, comments, and upvotes.

---

## Database

The application uses three main database tables:

```text
projects
comments
upvotes
```

The `upvotes` table uses a unique project/user combination so one authenticated user cannot upvote the same project more than once.

Row Level Security is enabled for the database tables.

---

## Section A — Portal Audit

The repository contains the GDG portal review in:

```text
AUDIT.md
```

The audit covers:

- Desktop review
- Mobile review
- Search testing
- Filter testing
- Event details testing
- Recruitment navigation
- Announcements navigation
- Registration navigation
- Certificate navigation
- Confirmed functional/data issues
- UX suggestions

Evidence screenshots will be stored in:

```text
evidence/
```

---

## Testing

The application was tested for:

- Project submission
- Search
- Tag filtering
- Upvotes
- Duplicate upvote prevention
- Comments
- Data persistence
- Cross-browser shared data
- Mobile responsiveness
- Security handling of user-entered HTML
- Loading and error states

---

## Known Limitation

The application uses anonymous authentication.

Anonymous users receive a unique Supabase user identity, but the application does not currently provide a traditional account creation or profile system.

---

## Future Improvements

Possible future improvements include:

- Project editing and deletion
- Project owner profiles
- More advanced sorting
- Pagination for larger project feeds
- Project image or screenshot uploads
- Moderation tools
- Traditional user accounts
- User profile pages

---

## Author

Built as a GDG recruitment task.