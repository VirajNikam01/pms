import { viewUsers } from "./queries";

export async function renderUsersToUI() {
  try {
    const users = await viewUsers();
    const container = document.createElement("div");
    container.innerHTML = `
      <h2>Users</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (user) => `
                <tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.email}</td>
                  <td>${user.age}</td>
                  <td>${user.createdAt}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
    document.body.appendChild(container);
  } catch (error) {
    console.error("Error rendering users:", error);
  }
}