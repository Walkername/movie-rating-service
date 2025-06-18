import { useState } from "react";
import NavigationBar from "../../components/navigation/navigation";
import { addUser } from "../../api/user-api";

function AddUserPage() {
    const [formData, setFormData] = useState({
        username: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        addUser(formData)
            .then((data) => {
                console.log("User added successfully:", data);
                alert("User added successfully!");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error adding user");
            });
    };

    return (
        <>
            <NavigationBar />
            <div>
                <h1>Add User In DB</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <form className="new-user-form" onSubmit={handleSubmit}>
                        <label>Username:</label>
                        <br />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <br />

                        <label>Description:</label>
                        <br />
                        <textarea
                            rows="3"
                            placeholder="..."
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                        <br />

                        <input type="submit" value="Add" />
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddUserPage;