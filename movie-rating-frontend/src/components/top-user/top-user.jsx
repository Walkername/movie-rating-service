import { useEffect, useState } from "react";
import { getTopUser } from "../../api/user-api";

function TopUser() {
    const [topUser, setTopUser] = useState({
        username: "",
        averageRating: "",
        scores: ""
    });

    useEffect(() => {
        getTopUser()
            .then((data) => {
                setTopUser(data);
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