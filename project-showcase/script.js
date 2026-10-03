// ============================================================
// GDG PROJECT SHOWCASE
// Supabase-powered community project board
// ============================================================


// ============================================================
// SECURITY HELPERS
// ============================================================

// Convert special HTML characters into safe text.
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Only allow HTTP and HTTPS project links.
function getSafeLink(link) {

    try {

        const url = new URL(link);

        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {
            return url.href;
        }

    } catch (error) {
        // Invalid URL
    }

    return "#";
}


// ============================================================
// HTML ELEMENTS
// ============================================================

const projectForm = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");
const projectStatus = document.getElementById("projectStatus");
const searchInput = document.getElementById("searchInput");
const tagFilter = document.getElementById("tagFilter");

// ============================================================
// STATUS MESSAGES
// ============================================================

function showStatus(message) {

    projectStatus.textContent = message;

    projectStatus.classList.remove("hidden");
}


function hideStatus() {

    projectStatus.classList.add("hidden");
}


// ============================================================
// APPLICATION STATE
// ============================================================

let projects = [];
let currentUser = null;


// ============================================================
// AUTHENTICATION
// ============================================================

async function initializeUser() {

    // First check whether a session already exists.
    const {
        data: sessionData,
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError) {

        console.error(
            "Could not get authentication session:",
            sessionError
        );

        throw sessionError;
    }


    // Reuse the existing user if available.
    if (sessionData.session) {

        currentUser = sessionData.session.user;

        return;
    }


    // Otherwise create an anonymous user.
    const {
        data,
        error
    } = await supabaseClient.auth.signInAnonymously();

    if (error) {

        console.error(
            "Anonymous authentication failed:",
            error
        );

        throw error;
    }

    currentUser = data.user;
}


// ============================================================
// MIGRATE OLD LOCALSTORAGE DATA
// ============================================================

async function migrateLocalProjects() {

    // Check whether migration has already completed.
    const migrationComplete =
        localStorage.getItem("gdgLocalDataMigrated");


    if (migrationComplete === "true") {
        return;
    }


    // Read the old browser data.
    const localData =
        JSON.parse(
            localStorage.getItem("gdgProjects") || "[]"
        );


    // Nothing to migrate.
    if (!Array.isArray(localData) || localData.length === 0) {

        localStorage.setItem(
            "gdgLocalDataMigrated",
            "true"
        );

        return;
    }


    console.log(
        "Starting migration of",
        localData.length,
        "local projects..."
    );


    // Migrate every local project.
    for (const localProject of localData) {

        // --------------------------------------------
        // Find or create project
        // --------------------------------------------

        let remoteProject = null;


        const {
            data: existingProject,
            error: existingProjectError
        } = await supabaseClient
            .from("projects")
            .select("id")
            .eq("legacy_id", localProject.id)
            .maybeSingle();


        if (existingProjectError) {

            console.error(
                "Could not check existing project:",
                existingProjectError
            );

            throw existingProjectError;
        }


        if (existingProject) {

            remoteProject = existingProject;

        } else {

            const {
                data: insertedProject,
                error: insertProjectError
            } = await supabaseClient
                .from("projects")
                .insert({
                    title: localProject.title,
                    description: localProject.description,
                    tags: localProject.tags,
                    link: getSafeLink(localProject.link),
                    legacy_id: localProject.id
                })
                .select("id")
                .single();


            if (insertProjectError) {

                console.error(
                    "Could not migrate project:",
                    insertProjectError
                );

                throw insertProjectError;
            }


            remoteProject = insertedProject;
        }


        const remoteProjectId = remoteProject.id;


        // --------------------------------------------
        // Migrate comments
        // --------------------------------------------

        if (
            Array.isArray(localProject.comments) &&
            localProject.comments.length > 0
        ) {

            for (
                let index = 0;
                index < localProject.comments.length;
                index++
            ) {

                const commentText =
                    String(localProject.comments[index]).trim();


                if (!commentText) {
                    continue;
                }


                const legacyKey =
                    `${localProject.id}:comment:${index}:${commentText}`;


                const {
                    data: existingComment,
                    error: existingCommentError
                } = await supabaseClient
                    .from("comments")
                    .select("id")
                    .eq("legacy_key", legacyKey)
                    .maybeSingle();


                if (existingCommentError) {

                    console.error(
                        "Could not check existing comment:",
                        existingCommentError
                    );

                    throw existingCommentError;
                }


                if (!existingComment) {

                    const {
                        error: insertCommentError
                    } = await supabaseClient
                        .from("comments")
                        .insert({
                            project_id: remoteProjectId,
                            user_id: currentUser.id,
                            comment_text: commentText,
                            legacy_key: legacyKey
                        });


                    if (insertCommentError) {

                        console.error(
                            "Could not migrate comment:",
                            insertCommentError
                        );

                        throw insertCommentError;
                    }
                }
            }
        }


        // --------------------------------------------
        // Migrate local upvote
        // --------------------------------------------

        if (localProject.userHasUpvoted) {

            const legacyKey =
                `${localProject.id}:upvote`;


            const {
                data: existingUpvote,
                error: existingUpvoteError
            } = await supabaseClient
                .from("upvotes")
                .select("id")
                .eq("legacy_key", legacyKey)
                .maybeSingle();


            if (existingUpvoteError) {

                console.error(
                    "Could not check existing upvote:",
                    existingUpvoteError
                );

                throw existingUpvoteError;
            }


            if (!existingUpvote) {

                const {
                    error: insertUpvoteError
                } = await supabaseClient
                    .from("upvotes")
                    .insert({
                        project_id: remoteProjectId,
                        user_id: currentUser.id,
                        legacy_key: legacyKey
                    });


                if (insertUpvoteError) {

                    // Unique constraint means it is already there.
                    if (insertUpvoteError.code !== "23505") {

                        console.error(
                            "Could not migrate upvote:",
                            insertUpvoteError
                        );

                        throw insertUpvoteError;
                    }
                }
            }
        }
    }


    // Mark migration as complete only after everything succeeds.
    localStorage.setItem(
        "gdgLocalDataMigrated",
        "true"
    );


    console.log("Local data migration completed.");
}


// ============================================================
// LOAD PROJECTS FROM SUPABASE
// ============================================================

async function loadProjects() {

    showStatus("Loading projects...");


    const {
        data,
        error
    } = await supabaseClient
        .from("projects")
        .select(`
            id,
            title,
            description,
            tags,
            link,
            created_at,
            comments (
                id,
                comment_text,
                created_at
            ),
            upvotes (
                id,
                user_id
            )
        `)
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Could not load projects:",
            error
        );

        throw error;
    }


    projects = data.map(function(project) {

        const comments =
            Array.isArray(project.comments)
                ? project.comments
                : [];


        const upvotes =
            Array.isArray(project.upvotes)
                ? project.upvotes
                : [];


        return {
            id: project.id,
            title: project.title,
            description: project.description,
            tags: Array.isArray(project.tags)
                ? project.tags
                : [],
            link: project.link,

            comments: comments,

            upvotes: upvotes.length,

            userHasUpvoted: upvotes.some(function(upvote) {
                return upvote.user_id === currentUser.id;
            })
        };
    });

    hideStatus();


    filterProjects();
}


// ============================================================
// DISPLAY PROJECTS
// ============================================================

function renderProjects(projectsToDisplay) {

    projectList.innerHTML = "";


    // Empty state
    if (projectsToDisplay.length === 0) {

        projectList.innerHTML = `
            <div class="empty-state">
                <h3>No projects found</h3>
                <p>
                    Try changing your search or filter,
                    or submit a new project.
                </p>
            </div>
        `;

        return;
    }


    // Create project cards
    projectsToDisplay.forEach(function(project) {

        const card =
            document.createElement("article");


        card.className = "project-card";


        const commentsHtml =
            project.comments.length === 0

                ? `
                    <p>
                        No feedback yet.
                        Be the first to comment!
                    </p>
                `

                : project.comments
                    .map(function(comment) {

                        return `
                            <div class="comment">
                                ${escapeHtml(
                                    comment.comment_text
                                )}
                            </div>
                        `;

                    })
                    .join("");


        const upvoteText =
            project.userHasUpvoted
                ? `✓ Upvoted (${project.upvotes})`
                : `👍 Upvote (${project.upvotes})`;


        card.innerHTML = `

            <h3>
                ${escapeHtml(project.title)}
            </h3>

            <p class="project-description">
                ${escapeHtml(project.description)}
            </p>

            <div class="tags">

                ${
                    project.tags
                        .map(function(tag) {

                            return `
                                <span class="tag">
                                    ${escapeHtml(tag)}
                                </span>
                            `;

                        })
                        .join("")
                }

            </div>


            <a
                href="${escapeHtml(
                    getSafeLink(project.link)
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
            >
                View Project ↗
            </a>


            <div class="project-actions">

                <button
    class="action-button upvote-button"
    type="button"
    data-project-id="${project.id}"
    aria-pressed="${project.userHasUpvoted}"
    aria-label="${
        project.userHasUpvoted
            ? "You already upvoted this project"
            : "Upvote this project"
    }"
    ${project.userHasUpvoted ? "disabled" : ""}
>
    ${upvoteText}
</button>

            </div>


            <div class="comments">

                <h4>
                    💬 Feedback (${project.comments.length})
                </h4>

                <div class="comment-list">
                    ${commentsHtml}
                </div>


                <form
                    class="comment-form"
                    data-project-id="${project.id}"
                >

                    <input
                        type="text"
                        class="comment-input"
                        placeholder="Write short feedback..."
                        maxlength="300"
                        required
                    >

                    <button
                        type="submit"
                        class="action-button"
                    >
                        Add Comment
                    </button>

                </form>

            </div>
        `;


        projectList.appendChild(card);
    });
}


// ============================================================
// SUBMIT PROJECT
// ============================================================

projectForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const title =
            document
                .getElementById("projectTitle")
                .value
                .trim();


        const description =
            document
                .getElementById("projectDescription")
                .value
                .trim();


        const tagsInput =
            document
                .getElementById("projectTags")
                .value
                .trim();


        const link =
            document
                .getElementById("projectLink")
                .value
                .trim();


        // Basic link validation
        if (!/^https?:\/\//i.test(link)) {

            alert(
                "Please enter a valid HTTP or HTTPS project link."
            );

            return;
        }


        const tags =
            tagsInput
                .split(",")
                .map(function(tag) {
                    return tag.trim();
                })
                .filter(function(tag) {
                    return tag !== "";
                });


        try {

                    showStatus("Submitting project...");

            const {
                error
            } = await supabaseClient
                .from("projects")
                .insert({
                    title: title,
                    description: description,
                    tags: tags,
                    link: getSafeLink(link)
                });


            if (error) {
                throw error;
            }


            projectForm.reset();


            alert(
                "Project submitted successfully!"
            );


            await loadProjects();

        } catch (error) {

            console.error(
                "Project submission failed:",
                error
            );

            alert(
                "Could not submit project. Please try again."
            );
        }
    }
);


// ============================================================
// UPVOTES
// ============================================================

async function upvoteProject(projectId) {

    const project =
        projects.find(function(project) {
            return project.id === projectId;
        });


    if (!project) {
        return;
    }


    if (project.userHasUpvoted) {

        alert(
            "You have already upvoted this project."
        );

        return;
    }


    try {

                showStatus("Saving your upvote...");

        const {
            error
        } = await supabaseClient
            .from("upvotes")
            .insert({
                project_id: projectId,
                user_id: currentUser.id
            });


        if (error) {

            // PostgreSQL unique violation.
            if (error.code === "23505") {

                alert(
                    "You have already upvoted this project."
                );

            } else {

                throw error;
            }

        } else {

            await loadProjects();
        }

    } catch (error) {

        console.error(
            "Upvote failed:",
            error
        );

        alert(
            "Could not submit your upvote."
        );
    }
}


// ============================================================
// COMMENTS
// ============================================================

async function addComment(
    projectId,
    commentText
) {

    const cleanedComment =
        commentText.trim();


    if (cleanedComment === "") {
        return;
    }


    try {

                showStatus("Adding feedback...");

        const {
            error
        } = await supabaseClient
            .from("comments")
            .insert({
                project_id: projectId,
                user_id: currentUser.id,
                comment_text: cleanedComment
            });


        if (error) {
            throw error;
        }


        await loadProjects();

    } catch (error) {

        console.error(
            "Comment submission failed:",
            error
        );

        alert(
            "Could not add your feedback."
        );
    }
}


// ============================================================
// EVENT DELEGATION FOR UPVOTES
// ============================================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "upvote-button"
            )
        ) {

            const projectId =
                Number(
                    event.target.dataset.projectId
                );


            upvoteProject(projectId);
        }
    }
);


// ============================================================
// EVENT DELEGATION FOR COMMENTS
// ============================================================

document.addEventListener(
    "submit",
    function(event) {

        if (
            event.target.classList.contains(
                "comment-form"
            )
        ) {

            event.preventDefault();


            const projectId =
                Number(
                    event.target.dataset.projectId
                );


            const commentInput =
                event.target.querySelector(
                    ".comment-input"
                );


            addComment(
                projectId,
                commentInput.value
            );
        }
    }
);


// ============================================================
// SEARCH + FILTER
// ============================================================

function filterProjects() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedTag =
        tagFilter.value
            .toLowerCase();


    const filteredProjects =
        projects.filter(function(project) {

            const projectText = (
                project.title +
                " " +
                project.description +
                " " +
                project.tags.join(" ")
            ).toLowerCase();


            const matchesSearch =
                projectText.includes(searchText);


            const matchesTag =
                selectedTag === "all" ||
                project.tags.some(function(tag) {

                    return (
                        tag.toLowerCase() ===
                        selectedTag
                    );
                });


            return (
                matchesSearch &&
                matchesTag
            );
        });


    renderProjects(filteredProjects);
}


searchInput.addEventListener(
    "input",
    filterProjects
);


tagFilter.addEventListener(
    "change",
    filterProjects
);


// ============================================================
// APPLICATION STARTUP
// ============================================================

async function startApplication() {

    try {

        await initializeUser();

        await migrateLocalProjects();

        await loadProjects();


        console.log(
            "GDG Project Showcase is ready."
        );

        } catch (error) {

        console.error(
            "Application startup failed:",
            error
        );

        showStatus(
            "Unable to connect to the project database."
        );

        projectList.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load projects</h3>

                <p>
                    Please refresh the page and try again.
                </p>
            </div>
        `;
    }
}


startApplication();