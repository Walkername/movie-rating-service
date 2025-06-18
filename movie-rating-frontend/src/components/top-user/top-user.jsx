import { useEffect, useState } from "react";

function TopUser() {

    // TOP USER

    const [topUser, setTopUser] = useState({
        username: "",
        averageRating: "",
        scores: ""
    });

    useEffect(() => {
        const url = `${process.env.REACT_APP_USER_SERVICE_URL}/users/top-user`; // Replace with your API endpoint

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch movie");
                }
                return response.json();
            })
            .then((data) => {
                setTopUser(data); // Set the movie data
            })
            .catch((error) => {
                console.error("Error fetching movie:", error);
            });
    }, []);

    return (
        <div>
            <h2>Top User: {topUser.username}</h2>
            <div>
                <b>Average rating: </b>{topUser.averageRating}
            </div>
            <div>
                <b>Scores: </b>{topUser.scores}
            </div>
        </div>
    )
}

export default TopUser;