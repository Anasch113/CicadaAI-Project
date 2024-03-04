import { useContext, useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { AuthContext } from "../../providers/AuthProviders";

const History = () => {
    
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);

    const [selectedNote, setSelectedNote] = useState(null);
    useEffect(() => {
        loadData();
    }, []);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const handleDeleteNote = () => {
        if (selectedNote._id) {
            fetch(
                `${import.meta.env.VITE_SERVER_API}/delete-note/${
                    selectedNote._id
                }`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((result) => {
                    console.log(result);
                    if (result.message) {
                        const updatedNotes = notes.filter(
                            (note) => note._id !== selectedNote._id
                        );
                        setNotes(updatedNotes);
                        setSelectedNote(null);
                    }
                })
                .catch((error) => {
                    console.log("Error deleting note:", error);
                    // Handle the error appropriately, e.g., show a user-friendly message
                });
        }
    };

    const loadData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_API}/notes`
            );
            const result = await response.json();
            setNotes(result);
            console.log("loaded notes", result);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="container container-fluid">
           <div className="pt-5">
           <h1 className="text-center  pt-5 pb-3 text-secondary">History</h1>
           <div className="left-container">
                        <div className="w-50">
                            {" "}
                            <ListGroup>
                                {notes
                                    .filter((note) => note.user === user?.email)
                                    .map((note, index) => (
                                        <ListGroup.Item
                                            className="mb-2"
                                            key={index}
                                            action
                                            active={
                                                selectedNote &&
                                                selectedNote._id === note._id
                                            }
                                            onClick={() =>
                                                handleNoteClick(note)
                                            }
                                        >
                                            {note.title}
                                            <h6 className="h6 text-dark">
                                                {note.date}
                                            </h6>
                                        </ListGroup.Item>
                                    ))}
                            </ListGroup>
                        </div>
                        {selectedNote && (
                            <Button
                                className="delete-btn"
                                onClick={handleDeleteNote}
                            >
                                Delete Note
                            </Button>
                        )}
                    </div>
           </div>
        </div>
    );
};

export default History;