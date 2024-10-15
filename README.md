# To-Do List Application

This guide will help you set up and run the To-Do List application, including the frontend (Quasar), backend API (PHP), and database.

## Installation and Setup

### 1. Extract the Files

1. **Unzip the provided file**:
   - Extract the contents of the zipped folder to a location on your system.

### 2. Set Up the Backend (API and Database)

1. **Copy the `TodoList` folder** to your `htdocs`:

   - Open your XAMPP `htdocs` directory, usually located at:

     ```bash
     C:/xampp/htdocs/
     ```

     ```
     C:/xampp/htdocs/TodoList/api
     ```

2. **Set up the database**:

   - Open **phpMyAdmin** by navigating to:
     ```
     http://localhost/phpmyadmin/
     ```
   - Create a new database named `todo_db`.
   - Import the SQL script found in the `database` folder. This will create the necessary tables for tasks and key results.
     - File path:
       ```
       TodoList/database/todoListDb.sql
       ```

3. **Start XAMPP**:
   - Open XAMPP and start **Apache** and **MySQL** services.

### 3. Set Up the Frontend (Quasar)

1. **Navigate to the `todo-list` folder**:

   - Open a terminal :
     ```bash
     cd path/to/todo-list
     ```

2. **Install dependencies**:

   - Run the following command to install all necessary Node.js dependencies:
     ```bash
     npm install
     ```

3. **Run the development server**:
   - Start the Quasar development server:
     ```bash
     quasar dev
     ```
   - The application will run at:
     ```
     http://localhost:8080/#/onboarding/
     ```

### 4. Access the To-Do List

1. **Navigate to the Onboarding page**:

   - Open your browser and go to:
     ```
     http://localhost:8080/#/onboarding/
     ```

2. **Access the To-Do List**:

   - Click on the **To-Do List** link to view and manage tasks.

3. **Create a New Task**:
   - Click the **Create New Task** button to add a new task, including key results, tags, and milestones.
