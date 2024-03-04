import { useContext, useEffect, useRef, useState } from "react";
import { Button, ListGroup, Alert, Row, Col, Spinner } from "react-bootstrap";
import "./Dashboard.css";
import { FaPlay, FaPause, FaStop, FaTrash, FaCheck } from "react-icons/fa";
import { BsRecordCircle } from "react-icons/bs";
import axios from "axios";
import { AuthContext } from "../../providers/AuthProviders";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showRecordBtn, setShowRecordBtn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedAudios, setRecordedAudios] = useState([]);
    const [transcription, setTranscriptionResult] = useState("");
    const mediaRecorder = useRef(null);
    const audioRef = useRef(new Audio());
    const chunks = useRef([]);
    const timerRef = useRef(null);
    const [response1, setResponse1] = useState("");
    const [response2, setResponse2] = useState("");
    const [response3, setResponse3] = useState("");
    const [response4, setResponse4] = useState("");
    const [response5, setResponse5] = useState("");
    const [response6, setResponse6] = useState("");
    const [response7, setResponse7] = useState("");
    const [response8, setResponse8] = useState("");
    const [response9, setResponse9] = useState("");
    const [response10, setResponse10] = useState("");
    const [response11, setResponse11] = useState("");
    const [speechText, setSpeechText] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [reform, setReform] = useState("default");

    const toggleDropdown = () => {
        console.log("dropdown true");
        setDropdownOpen(!isDropdownOpen);
        console.log(isDropdownOpen);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_API}/notes`
            );
            const result = await response.json();
            setNotes(result);
            setIsLoading(false);
            console.log("loaded notes", result);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const getDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Months are 0-indexed
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        // const seconds = currentDate.getSeconds();

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
        console.log(formattedDateTime);
        return formattedDateTime;
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleInputChange = (event) => {
        setNoteTitle(event.target.value);
    };

    const handleSave = () => {
        console.log("Note Title:", noteTitle);
        closeModal();
        startRecording();
    };

    const baseUrl = "https://api.assemblyai.com/v2";

    const headers = {
        authorization: "5909f6849b9545cfb34bf93aea0ba084",
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    if (chunks.current.length > 0) {
                        chunks.current = []; // Clear existing chunks
                    }

                    chunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(chunks.current, {
                    type: "audio/wav",
                });
                const audioUrl = URL.createObjectURL(audioBlob);

                setRecordedAudios((prevAudios) => [
                    ...prevAudios,
                    { url: audioUrl, isSubmitted: false },
                ]);

                audioRef.current.src = audioUrl;

                // Step 3: Upload the local file to the AssemblyAI API
                const uploadResponse = await axios.post(
                    `${baseUrl}/upload`,
                    audioBlob,
                    {
                        headers: {
                            ...headers,
                            "Content-Type": "multipart/form-data", // Set the content type for FormData
                        },
                    }
                );

                const uploadUrl = uploadResponse.data.upload_url;

                // Step 4: Create a JSON payload with the audio_url parameter
                const data = {
                    audio_url: uploadUrl, // Use the upload_url returned by the AssemblyAI API
                };

                // Step 5: Make a POST request to the AssemblyAI API endpoint with the payload and headers
                const transcriptUrl = `${baseUrl}/transcript`;
                const response = await axios.post(transcriptUrl, data, {
                    headers,
                });

                // Step 6: Poll the API to check the status of the transcription
                const transcriptId = response.data.id;
                const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`;

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const pollingResponse = await axios.get(pollingEndpoint, {
                        headers: headers,
                    });
                    const transcriptionResult = pollingResponse.data;

                    if (transcriptionResult.status === "completed") {
                        console.log(transcriptionResult.text);
                        setTranscriptionResult(transcriptionResult.text);
                        break;
                    } else if (transcriptionResult.status === "error") {
                        throw new Error(
                            `Transcription failed: ${transcriptionResult.error}`
                        );
                    } else {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 3000)
                        );
                    }
                }
            };

            mediaRecorder.current.start();
            setIsRecording(true);

            // Start recording timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorder.current &&
            mediaRecorder.current.state === "recording"
        ) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
            setRecordingTime(0);
        }
    };

    const togglePlayback = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const deleteAudio = (index) => {
        setRecordedAudios((prevAudios) => {
            const updatedAudios = [...prevAudios];
            updatedAudios.splice(index, 1);
            return updatedAudios;
        });
    };

    const submitAudio = (index) => {
        setRecordedAudios((prevAudios) => {
            const updatedAudios = [...prevAudios];
            updatedAudios[index].isSubmitted = true;
            return updatedAudios;
        });
    };

    useEffect(() => {
        audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
        });

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            audioRef.current.removeEventListener("ended", () => {
                setIsPlaying(false);
            });
        };
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
                        setIsLoading(false);
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
                        setIsLoading(false);
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

    const addNewNote = async (
        text1,
        text2,
        text3,
        text4,
        text5,
        text6,
        text7,
        text8,
        text9,
        text10,
        text11
    ) => {
        const dateCreated = getDate();
        // Dynamically assign id based on the length of the existing array
        const newNote = {
            user: user.email,
            title: noteTitle,
            date: dateCreated,
            dapData: text1,
            dapAssessment: text2,
            dapPlan: text3,
            birpBehavior: text4,
            birpIntervention: text5,
            birpResponse: text6,
            birpPlan: text7,
            soapSubjective: text8,
            soapObjective: text9,
            soapAssessment: text10,
            soapPlan: text11,
        };
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_API}/add-note`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newNote),
                }
            );
            const data = await response.json();
            console.log(data);
            loadData();
        } catch (error) {
            console.log(error);
        }
    };

    const getSummeries = async (inquire) => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: inquire,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_API}/completions`,
                options
            );
            const data = await response.json();
            console.log(data);
            const respondedData1 = data[0].choices[0].message.content;
            const respondedData2 = data[1].choices[0].message.content;
            const respondedData3 = data[2].choices[0].message.content;
            const respondedData4 = data[3].choices[0].message.content;
            const respondedData5 = data[4].choices[0].message.content;
            const respondedData6 = data[5].choices[0].message.content;
            const respondedData7 = data[6].choices[0].message.content;
            const respondedData8 = data[7].choices[0].message.content;
            const respondedData9 = data[8].choices[0].message.content;
            const respondedData10 = data[9].choices[0].message.content;
            const respondedData11 = data[10].choices[0].message.content;
            setResponse1(respondedData1);
            setResponse2(respondedData2);
            setResponse3(respondedData3);
            setResponse4(respondedData4);
            setResponse5(respondedData5);
            setResponse6(respondedData6);
            setResponse7(respondedData7);
            setResponse8(respondedData8);
            setResponse9(respondedData9);
            setResponse10(respondedData10);
            setResponse11(respondedData11);
            console.log(
                "DAP & BIRP & SOAP Response:",
                response1,
                response2,
                response3,
                response4,
                response5,
                response6,
                response7,
                response8,
                response9,
                response9,
                response10,
                response11
            );
            addNewNote(
                respondedData1,
                respondedData2,
                respondedData3,
                respondedData4,
                respondedData5,
                respondedData6,
                respondedData7,
                respondedData8,
                respondedData9,
                respondedData10,
                respondedData11
            );
        } catch (error) {
            console.log(error);
            console.log("error fetching data");
        }
    };

    useEffect(() => {
        // Check if transcription has a length greater than 0
        if (transcription.length > 0) {
            setSpeechText(transcription);
            getSummeries(transcription);
            setTranscriptionResult("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcription]);

    const copyToClipboard = (reform) => {
        let clipboardContent;

        switch (reform) {
            case 'dap':
                clipboardContent = `DAP Note:\n\nSession Date:\nTherapist:\nPatient Name:\n\nPresenting problem:\n${selectedNote.dapData}\n\nAssessment:\n${selectedNote.dapAssessment}\n\nPlan:\n${selectedNote.dapPlan}`;
                break;
            case 'soap':
                clipboardContent = `SOAP Note:\n\nSubjective:\n${selectedNote.soapSubjective}\n\nObjective:\n${selectedNote.soapObjective}\n\nAssessment:\n${selectedNote.soapAssessment}\n\nPlan:\n${selectedNote.soapPlan}`;
                break;
            case 'birp':
                clipboardContent = `BIRP Note:\n\n\nBehavior:\n${selectedNote.birpBehavior}\n\nIntervention:\n${selectedNote.birpIntervention}\n\nResponse:\n${selectedNote.birpResponse}\n\nPlan:\n${selectedNote.birpPlan}`;
                break;
            default:
                clipboardContent = `${selectedNote.title}\n\nCreated on: ${selectedNote.date}\n\nDAP:\n\n${selectedNote.dapData}\n\n${selectedNote.dapAssessment}\n\n${selectedNote.dapPlan}\n\nBIRP:\n${selectedNote.birpBehavior}\n\n${selectedNote.birpIntervention}\n\n${selectedNote.birpResponse}\n\nBIRP Plan:\n${selectedNote.birpPlan}\n\nSOAP:\n${selectedNote.soapSubjective}\n\n${selectedNote.soapObjective}\n\n${selectedNote.soapAssessment}\n${selectedNote.soapPlan}`;
                break;
        }


        navigator.clipboard
            .writeText(clipboardContent)
            .then(() => {
                setIsCopied(true);

                // Reset the copy status after a short delay
                setTimeout(() => {
                    setIsCopied(false);
                }, 5000); // Reset after 2 seconds
            })
            .catch((err) => {
                console.error("Unable to copy text to clipboard", err);
            });
    };

    const menuController = () => {
        setDropdownOpen(false);
        setToggleMenu(!toggleMenu);
    };

    return (
        <div className="container py-5">
            <Row className="my-5">
                {/* Left Side */}
                <Col xs={12} md={4} className="p-3 border border-1">
                    <div className="d-flex justify-content-center my-3 py-2">
                        {" "}
                        <Button
                            variant="success"
                            block
                            onClick={() => setShowRecordBtn(!showRecordBtn)}
                        >
                            {!showRecordBtn ? "Start Recording" : "Close"}
                        </Button>
                    </div>
                    {showRecordBtn && (
                        <div className="custom-container">
                            <div className="custom-flex">
                                <button
                                    // onClick={startRecording}
                                    onClick={openModal}
                                    disabled={isRecording}
                                    className="custom-button"
                                >
                                    <BsRecordCircle
                                        className={`btn-icon ${
                                            isRecording
                                                ? "text-danger"
                                                : "text-dark"
                                        }`}
                                    />
                                    {isRecording ? "Recording" : "Start"}
                                </button>
                                <button
                                    onClick={stopRecording}
                                    disabled={!isRecording}
                                    className="custom-button"
                                >
                                    <FaStop className="btn-icon" />
                                    Stop
                                </button>
                                <button
                                    onClick={togglePlayback}
                                    disabled={!audioRef?.current?.src}
                                    className="custom-button"
                                >
                                    {isPlaying ? (
                                        <FaPause className="btn-icon" />
                                    ) : (
                                        <FaPlay className="btn-icon" />
                                    )}
                                    {isPlaying ? "Pause" : "Play"}
                                </button>
                            </div>

                            <div className="custom-info">
                                <span>{`Duration: ${recordingTime}s`}</span>
                            </div>
                            <div className="custom-recorded-audios">
                                <h2>Recorded Audios</h2>
                                <ul className="custom-list">
                                    {recordedAudios
                                        .slice(-1)
                                        .map((audio, index) => (
                                            <li
                                                key={index}
                                                className="custom-list-item"
                                            >
                                                <div className="custom-audio-container">
                                                    <audio
                                                        controls
                                                        className="custom-audio"
                                                    >
                                                        <source
                                                            src={audio.url}
                                                            type="audio/wav"
                                                        />
                                                        Your browser does not
                                                        support the audio tag.
                                                    </audio>
                                                    {!audio.isSubmitted && (
                                                        <div className="custom-actions">
                                                            <button
                                                                onClick={() =>
                                                                    submitAudio(
                                                                        index
                                                                    )
                                                                }
                                                                className="custom-action-button"
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteAudio(
                                                                        index
                                                                    )
                                                                }
                                                                className="custom-action-button"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <h4 className="py-2 bg-light">Notes:</h4>
                    <div className="left-container">
                        {isLoading ? (
                            <p className="text-center pt-5">
                                <Spinner />
                            </p>
                        ) : (
                            <div className="w-50">
                                {" "}
                                <ListGroup>
                                    {notes
                                        .filter(
                                            (note) => note.user === user?.email
                                        )
                                        .map((note, index) => (
                                            <ListGroup.Item
                                                className="mb-2"
                                                key={index}
                                                action
                                                active={
                                                    selectedNote &&
                                                    selectedNote._id ===
                                                        note._id
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
                        )}
                        {selectedNote && (
                            <Button
                                className="delete-btn"
                                onClick={handleDeleteNote}
                            >
                                {isLoading ? <Spinner /> : "Delete Note"}
                            </Button>
                        )}
                    </div>
                </Col>

                {/* Right Side */}
                <Col xs={12} md={8} className="p-3">
                    {selectedNote ? (
                        <Alert className="m-0 p-0" variant="info">
                            <div className="bg-light d-flex justify-content-between align-items-center py-3 rounded-1">
                                <div className="ms-2">
                                    <strong>{selectedNote.date}</strong>
                                    <p className="text-secondary h6">
                                        Title: {selectedNote.title}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-center align-items-center me-2">
                                    <Button
                                        className="btn btn-info"
                                        onClick={() =>copyToClipboard(reform)}
                                    >
                                        {isCopied ? "Copied!" : "Copy"}
                                    </Button>
                                    <div className="dropdown">
                                        <Button
                                            className="dropdown-btn"
                                            onClick={toggleDropdown}
                                        >
                                            Reform-
                                        </Button>
                                        {isDropdownOpen && (
                                            <div className="dropdown-content">
                                                <button
                                                    onClick={() => {
                                                        setReform("dap");
                                                        setDropdownOpen(false);
                                                    }}
                                                    className="dropdown-item"
                                                >
                                                    Only DAP
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        setReform("soap");
                                                    }}
                                                    className="dropdown-item"
                                                >
                                                    Only SOAP
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        setReform("birp");
                                                    }}
                                                    className="dropdown-item"
                                                >
                                                    Only BIRP
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        setReform("default");
                                                    }}
                                                    className="dropdown-item"
                                                >
                                                    Default
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="menu-toggle"
                                        onClick={menuController}
                                    >
                                        ☰{" "}
                                        {/* Unicode character for the menu icon */}
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <br />
                                {reform === "default" && (
                                    <div>
                                        DAP:
                                        <br /> {selectedNote.dapData}
                                        <br />
                                        {selectedNote.dapAssessment}
                                        <br />
                                        {selectedNote.dapPlan}
                                        <br />
                                        <br />
                                        BIRP:
                                        <br /> {selectedNote.birpBehavior}
                                        <br />
                                        {selectedNote.birpIntervention}
                                        <br />
                                        {selectedNote.birpResponse}
                                        <br />
                                        {selectedNote.birpPlan}
                                        <br />
                                        <br />
                                        SOAP:
                                        <br />
                                        {selectedNote.soapSubjective}
                                        <br />
                                        {selectedNote.soapObjective}
                                        <br />
                                        {selectedNote.soapAssessment}
                                        <br />
                                        {selectedNote.soapPlan}
                                    </div>
                                )}
                                {reform === "dap" && (
                                    <div>
                                        DAP Note:
                                        <br />
                                        <br />
                                        Session Date:
                                        <br />
                                        Therapist:
                                        <br />
                                        Patient Name:
                                        <br />
                                        <br />
                                        <br />
                                        Presenting Problem:{" "}
                                        {selectedNote.dapData}
                                        <br />
                                        <br />
                                        Assessment: {selectedNote.dapAssessment}
                                        <br />
                                        <br />
                                        Plan: {selectedNote.dapPlan}
                                    </div>
                                )}
                                {reform === "soap" && (
                                    <div>
                                        SOAP Note:
                                        <br />
                                        <br />
                                        Subjective:{" "}
                                        {selectedNote.soapSubjective}
                                        <br />
                                        <br />
                                        Objective: {selectedNote.soapObjective}
                                        <br />
                                        <br />
                                        Assessment:{" "}
                                        {selectedNote.soapAssessment}
                                        <br />
                                        <br />
                                        Plan: {selectedNote.soapPlan}
                                        <br />
                                    </div>
                                )}
                                {reform === "birp" && (
                                    <div>
                                        BIRP Note:
                                        <br />
                                        <br />
                                        Behavior: {selectedNote.birpBehavior}
                                        <br />
                                        <br />
                                        Intervention:{" "}
                                        {selectedNote.birpIntervention}
                                        <br />
                                        <br />
                                        Response: {selectedNote.birpResponse}
                                        <br />
                                        <br />
                                        Plan: {selectedNote.birpPlan}
                                    </div>
                                )}
                            </div>
                            {toggleMenu && (
                                <div className="right-menu">
                                    <Link to="/history" className="menu-links">
                                        History
                                    </Link>
                                </div>
                            )}
                        </Alert>
                    ) : (
                        <Alert variant="warning">
                            Select a note to display. <br /> <br />
                            <br /> Transcribing speech into text:
                            {speechText}
                            <br />
                        </Alert>
                    )}
                </Col>
            </Row>

            {isModalOpen && (
                <div className="Modal">
                    <div className="ModalContent">
                        <span className="CloseButton" onClick={closeModal}>
                            &times;
                        </span>
                        <div className="ModalBody">
                            <label htmlFor="noteTitle">Note Title:</label>
                            <input
                                type="text"
                                id="noteTitle"
                                value={noteTitle}
                                onChange={handleInputChange}
                                placeholder="Enter your note title"
                                required
                            />
                        </div>
                        <div className="ModalFooter">
                            <button
                                className="btn btn-danger"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
