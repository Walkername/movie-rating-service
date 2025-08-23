import NavigationBar from "../../navigation/navigation-bar/navigation-bar";
import { useNavigate } from "react-router-dom";
import AddMovieForm from "../add-movie-form/add-movie-form";
import { useState } from "react";
import { getMovie, searchMovieByTitle } from "../../../api/movie-api";
import MovieDetails from "../../movie/movie-details/movie-details";
import MovieCardBar from "../../movie-catalog/movie-card-bar/movie-card-bar";

function AdminMoviesTool() {
    const navigate = useNavigate();

    const handleNavigate = (target) => {
        navigate(target);
    }

    const [movieTool, setMovieTool] = useState("add-movie");

    const chooseMovieTool = (e) => {
        setMovieTool(e.target.value);
    }

    const [idToSend, setIdToSend] = useState("");
    const [titleToSend, setTitleToSend] = useState("");

    const [movies, setMovies] = useState([]);

    const [statusMessage, setStatusMessage] = useState("");

    const handleGetMovieById = (e) => {
        e.preventDefault();

        getMovie(idToSend)
            .then((data) => {
                setMovies([data]);
            })
            .catch(() => {
                setMovies([]);
                setStatusMessage("Such movie was not found");
            })
    }

    const handleGetMovieByTitle = (e) => {
        e.preventDefault();

        searchMovieByTitle(titleToSend)
            .then((data) => {
                setMovies(data);
            })
            .catch(() => {
                setMovies([]);
                setStatusMessage("No movies found with that title");
            })
    }

    const handleIdInput = (e) => {
        setIdToSend(e.target.value);
    }

    const handleTitleInput = (e) => {
        setTitleToSend(e.target.value);
    }

    const showMovieTool = () => {
        switch (movieTool) {
            case "add-movie": return <AddMovieForm />
            case "search-movie": return (
                <>
                    <form onSubmit={handleGetMovieById}>
                        <label>Search movie by id: </label>
                        <input type="text" value={idToSend} onChange={handleIdInput} />{" "}
                        <input type="submit" value="Get" />
                    </form>
                    <br></br>

                    <form onSubmit={handleGetMovieByTitle}>
                        <label>Search movie by title: </label>
                        <input type="text" value={titleToSend} onChange={handleTitleInput} />{" "}
                        <input type="submit" value="Get" />
                    </form>

                    <br></br>
                </>
            );
        }
    }

    return (
        <>
            <NavigationBar />
            <div>
                <h1>Admin Tools</h1>
            </div>
            <div className="page-content-container">
                <div className="page-content">
                    <div className="admin-content">
                        <div className="admin-toolbar">
                            <button
                                onClick={() => handleNavigate("/admin/users-tool")}
                            >Users</button>
                            <button
                                onClick={() => handleNavigate("/admin/movies-tool")}
                            >Movies</button>
                        </div>
                        <div>
                            <label htmlFor="movie-tool">Movie Tool: </label>
                            <select id="movie-tool" onChange={chooseMovieTool} defaultValue="add-movie">
                                <option value="add-movie" >Add Movie</option>
                                <option value="search-movie">Search Movie</option>
                            </select>

                            <br></br>
                            <br></br>

                            {showMovieTool()}

                            <br></br>
                            <div>
                                {
                                    movies.length == 1
                                        ? <MovieDetails movie={movies[0]} />
                                        :
                                        movies.map((movie, index) => {
                                            return (
                                                <MovieCardBar
                                                    movie={movie}
                                                    index={index}
                                                    handleNavigate={handleNavigate}
                                                />
                                            );
                                        })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminMoviesTool;