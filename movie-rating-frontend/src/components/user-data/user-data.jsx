import RatedMoviesList from "../rated-movies-list/rated-movies-list";

function UserData({ user }) {
    return (
        <div>
            <h2>{user.username}</h2>

            <h3>Description</h3>
            <div>
                {user.description}
            </div>

            <h3>Favourite movie</h3>
            <div>
                {user.favouriteMovie}
            </div>

            <h3>Average rating</h3>
            <div>
                {user.averageRating}
            </div>

            <h3>Scores: {user.scores}</h3>

            <RatedMoviesList userId={user.id} />
        </div>
    )
}

export default UserData;