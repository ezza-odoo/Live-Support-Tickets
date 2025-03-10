document.getElementById("ticketForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const descriptionInput = document.getElementById("descriptionInput");
  const description = descriptionInput ? descriptionInput.value.trim() : null;
  const titleInput = document.getElementById("title");
  const ticketTitle = titleInput ? titleInput.value.trim() : null;
  const ticketStage = document.querySelector('input[name="stage"]:checked').value;

  // Show loading state
  const loadingElement = document.createElement("div");
  loadingElement.className = "loading";
  loadingElement.textContent = "Creating ticket...";
  loadingElement.style.textAlign = "center";
  loadingElement.style.margin = "20px";
  loadingElement.style.fontWeight = "bold";
  document.body.appendChild(loadingElement);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];

      try {
        const url = new URL(activeTab.url);

        if (
          url.searchParams.has("active_id") ||
          url.href.includes("odoo.com/odoo/discuss") ||
          url.href.includes("action_discuss")
        ) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { message: description, ticketType: ticketStage, ticketTitle: ticketTitle },
            (response) => {
              // Remove loading state
              if (loadingElement) {
                document.body.removeChild(loadingElement);
              }

              if (chrome.runtime.lastError) {
                console.error(
                  "Error sending message to content script:",
                  chrome.runtime.lastError.message
                );
                showError("Failed to communicate with the page. Please try again.");
              } else if (response && response.success) {
                console.log(
                  "Task created successfully. Task ID:",
                  response.taskId
                );
                showSuccess(response.ticket);
              } else {
                console.error(
                  "Error from content script:",
                  response ? response.error : "Unknown error"
                );
                showError(response ? response.error : "An unknown error occurred");
              }
            }
          );
        } else {
          if (loadingElement) {
            document.body.removeChild(loadingElement);
          }
          console.log("The current page URL is not a discuss channel chat");
          showError("This feature only works on Odoo Discuss pages");
        }
      } catch (error) {
        if (loadingElement) {
          document.body.removeChild(loadingElement);
        }
        console.error("Failed to process the tab URL:", error);
        showError("Invalid page URL");
      }
    } else {
      if (loadingElement) {
        document.body.removeChild(loadingElement);
      }
      console.log("No active tab found.");
      showError("No active tab found");
    }
  });
});

/**
 * Shows a success message and link to the created ticket
 * @param {string} ticketUrl - URL to the created ticket
 */
function showSuccess(ticketUrl) {
  document.body.classList.add("success");
  document.querySelector(".success-text").classList.remove("hide");
  
  const ticketButton = document.createElement("a");
  ticketButton.href = ticketUrl;
  ticketButton.target = "_blank";
  ticketButton.textContent = "Ticket";
  ticketButton.style.display = "block";
  ticketButton.style.margin = "20px auto 0"; 
  ticketButton.style.width = "70%";
  ticketButton.style.padding = "10px";
  ticketButton.style.textAlign = "center";
  ticketButton.style.backgroundColor = "#007bff";
  ticketButton.style.color = "#fff";
  ticketButton.style.border = "none";
  ticketButton.style.borderRadius = "5px";
  ticketButton.style.textDecoration = "none";
  ticketButton.style.fontSize = "16px";
  ticketButton.style.cursor = "pointer";
  ticketButton.style.fontSize = "18px";
  ticketButton.style.fontWeight = "bold";
  
  document.body.appendChild(ticketButton);
  
  setTimeout(() => {
    window.close();
  }, 5000);
}

/**
 * Shows an error message to the user
 * @param {string} errorMessage - The error message to display
 */
function showError(errorMessage) {
  // Hide the form to make space for the error message
  const form = document.getElementById("ticketForm");
  form.style.display = "none";
  
  document.body.classList.add("failed");
  const failedTextElement = document.querySelector(".failed-text");
  
  // Reset any existing styles
  failedTextElement.removeAttribute("style");
  
  // Update the existing span with the error message
  failedTextElement.textContent = errorMessage;
  failedTextElement.classList.remove("hide");
  
  // Style the error message for better visibility and centering
  failedTextElement.style.color = "#721c24";
  failedTextElement.style.backgroundColor = "#f8d7da";
  failedTextElement.style.border = "1px solid #f5c6cb";
  failedTextElement.style.borderRadius = "5px";
  failedTextElement.style.padding = "15px";
  failedTextElement.style.margin = "20px auto";
  failedTextElement.style.display = "block";
  failedTextElement.style.textAlign = "center";
  failedTextElement.style.maxWidth = "90%";
  failedTextElement.style.boxSizing = "border-box";
  failedTextElement.style.wordWrap = "break-word";
  failedTextElement.style.fontSize = "14px";
  failedTextElement.style.fontWeight = "bold";
  failedTextElement.style.lineHeight = "1.4";
  
  setTimeout(() => {
    window.close();
  }, 4000);
}