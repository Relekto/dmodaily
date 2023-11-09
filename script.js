  document.addEventListener("DOMContentLoaded", function() {
      const userSelect = document.getElementById("user-select");
      const todoList = document.getElementById("todo-list");
      const taskInput = document.getElementById("task");
      const addTaskButton = document.getElementById("add-task");

      // Function to fetch tasks for a selected user
      function fetchTasks(selectedUser) {
        fetch('tasks.json') // Replace with the actual path to your tasks.json
          .then(response => response.json())
          .then(data => {
            const userTasks = data[selectedUser] || [];
            displayTasks(userTasks);
          })
          .catch(error => console.error('Error fetching tasks:', error));
      }

      // Function to display tasks in the list
      function displayTasks(tasks) {
        todoList.innerHTML = "";
        tasks.forEach(taskText => {
          const listItem = createTaskListItem(taskText);
          todoList.appendChild(listItem);
        });
      }

      // Function to create a new task list item
      function createTaskListItem(taskText) {
        const listItem = document.createElement("li");
        listItem.textContent = taskText;
        return listItem;
      }

      // Handle user selection change
      userSelect.addEventListener("change", function() {
        const selectedUser = userSelect.value;
        fetchTasks(selectedUser);
      });

      // Handle "Add" button click
      addTaskButton.addEventListener("click", function() {
        const selectedUser = userSelect.value;
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
          // Fetch existing tasks
          fetch('tasks.json') // Replace with the actual path to your tasks.json
            .then(response => response.json())
            .then(data => {
              // Add the new task
              data[selectedUser] = data[selectedUser] || [];
              data[selectedUser].push(taskText);

              // Update the tasks.json file
              return fetch('tasks.json', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
            })
            .then(() => {
              // Fetch and display updated tasks
              fetchTasks(selectedUser);
            })
            .catch(error => console.error('Error updating tasks:', error));

          taskInput.value = ""; // Clear the input field
        }
      });

      // Initial fetch and display tasks for the default user
      const initialUser = userSelect.value;
      fetchTasks(initialUser);
    });
