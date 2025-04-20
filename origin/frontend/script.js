document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const messageContainer = document.getElementById('message-container');
  const statusElement = document.getElementById('status');
  const timestampElement = document.getElementById('timestamp');
  const refreshButton = document.getElementById('refresh-btn');
  
  // Function to fetch data from backend
  function fetchMessage() {
    // Get the base URL dynamically based on where the app is hosted
    const baseUrl = window.location.origin;
    
    // Fetch data from the API
    fetch(`${baseUrl}/api/message`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update the UI with the received data
        messageContainer.innerHTML = `<p>${data.message}</p>`;
        statusElement.textContent = data.attendanceStatus;
        
        // Format the timestamp
        const date = new Date(data.timestamp);
        timestampElement.textContent = date.toLocaleString();
      })
      .catch(error => {
        console.error('Error fetching message:', error);
        messageContainer.innerHTML = '<p>Error loading data from server</p>';
        statusElement.textContent = 'Error';
        statusElement.style.color = 'red';
      });
  }
  
  // Fetch message when page loads
  fetchMessage();
  
  // Add event listener for refresh button
  refreshButton.addEventListener('click', fetchMessage);
});