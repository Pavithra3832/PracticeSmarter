// ==========================================
// PRACTICESMARTER - BOOKMARKS PAGE
// ==========================================

// Login protection
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}


// ==========================================
// DOM ELEMENTS
// ==========================================

const bookmarkContainer =
    document.getElementById("bookmark-container");

const bookmarkEmpty =
    document.getElementById("bookmark-empty");


// ==========================================
// LOAD BOOKMARKS
// ==========================================

function getBookmarks() {

    try {

        const saved =
            localStorage.getItem("bookmarkedQuestions");

        if (!saved) {
            return [];
        }

        const bookmarks = JSON.parse(saved);

        return Array.isArray(bookmarks)
            ? bookmarks
            : [];

    } catch (error) {

        console.error(
            "Error loading bookmarks:",
            error
        );

        return [];

    }

}


// ==========================================
// DISPLAY BOOKMARKS
// ==========================================

function displayBookmarks() {

    const bookmarks = getBookmarks();

    console.log(
        "Bookmarks loaded:",
        bookmarks
    );


    if (!bookmarkContainer || !bookmarkEmpty) {

        console.error(
            "Bookmark container or empty state not found."
        );

        return;

    }


    // ======================================
    // NO BOOKMARKS
    // ======================================

    if (bookmarks.length === 0) {

        bookmarkContainer.innerHTML = "";

        bookmarkEmpty.style.display = "block";

        return;

    }


    // ======================================
    // BOOKMARKS EXIST
    // ======================================

    bookmarkEmpty.style.display = "none";


    bookmarkContainer.innerHTML = bookmarks.map(
        (bookmark, index) => {

            return `

                <div class="bookmark-card">

                    <div class="bookmark-card-header">

                        <div class="bookmark-meta">

                            <span class="bookmark-category">
                                💻 ${escapeHTML(
                                    bookmark.category || "General"
                                )}
                            </span>

                            <span class="bookmark-difficulty">
                                ${escapeHTML(
                                    bookmark.difficulty || "Easy"
                                )}
                            </span>

                            ${
                                bookmark.isAI
                                    ? `
                                        <span class="bookmark-ai">
                                            🤖 AI
                                        </span>
                                      `
                                    : ""
                            }

                        </div>


                        <button
                            type="button"
                            class="remove-bookmark-button"
                            data-index="${index}"
                            title="Remove Bookmark">

                            🗑️

                        </button>

                    </div>


                    <div class="bookmark-question">

                        <h3>
                            ${escapeHTML(
                                bookmark.question ||
                                "Question unavailable"
                            )}
                        </h3>

                    </div>


                    <div class="bookmark-answer">

                        <h4>
                            💡 Model Answer
                        </h4>

                        <p>
                            ${escapeHTML(
                                bookmark.answer ||
                                "No model answer available."
                            )}
                        </p>

                    </div>


                    <div class="bookmark-card-footer">

                        <span>
                            📅 Saved:
                            ${escapeHTML(
                                bookmark.date ||
                                "Recently"
                            )}
                        </span>

                    </div>

                </div>

            `;

        }
    ).join("");


    // ======================================
    // REMOVE BUTTONS
    // ======================================

    const removeButtons =
        document.querySelectorAll(
            ".remove-bookmark-button"
        );


    removeButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const index =
                    Number(
                        this.dataset.index
                    );

                removeBookmark(index);

            }
        );

    });

}


// ==========================================
// REMOVE BOOKMARK
// ==========================================

function removeBookmark(index) {

    const bookmarks = getBookmarks();


    if (
        index < 0 ||
        index >= bookmarks.length
    ) {
        return;
    }


    bookmarks.splice(index, 1);


    localStorage.setItem(
        "bookmarkedQuestions",
        JSON.stringify(bookmarks)
    );


    displayBookmarks();

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}


// ==========================================
// INITIALIZE
// ==========================================

displayBookmarks();