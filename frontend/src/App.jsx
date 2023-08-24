import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [item, setItem] = useState({
        Title: "",
        Complete: false,
    });
    const [allItems, setAllItems] = useState([]);
    const [err, setErr] = useState([]);

    // Load data from MongoDB
    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = import.meta.env.VITE_API_URL + "/all";

            try {
                const response = await axios.get(apiUrl);
                const sortedItems = response.data.sort((a, b) => {
                    if (a.Complete === b.Complete) return 0;
                    if (a.Complete) return 1;
                    return -1;
                });

                setAllItems(sortedItems);
                // setAllItems(response.data);
            } catch (err) {
                setErr(err.message);
                console.error("Error fetching data with axios:", err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Define the API endpoint
            const apiUrl = import.meta.env.VITE_API_URL + "/add"; // assuming the endpoint is '/add'

            // Make the POST request with the new item
            const response = await axios.post(apiUrl, item);

            // If successful, update local state and reset the input

            const sortedItems = [...allItems, response.data].sort((a, b) => {
                if (a.Complete === b.Complete) return 0;
                if (a.Complete) return 1;
                return -1;
            });
            setAllItems(sortedItems);
            setItem({ Title: "", Complete: false });
        } catch (error) {
            console.error("Error while adding item:", error);
        }
    };

    const handleDelete = async (e, indexToDelete) => {
        e.preventDefault();

        // Get the _id of the item to delete
        const idToDelete = allItems[indexToDelete]._id;

        try {
            // Define the API endpoint
            const apiUrl =
                import.meta.env.VITE_API_URL + `/delete/${idToDelete}`;

            // Send the DELETE request
            await axios.delete(apiUrl);

            // If successful, update local state
            const newItems = allItems.filter(
                (item, index) => index !== indexToDelete
            );
            setAllItems(newItems);
        } catch (error) {
            console.error("Error while deleting item:", error);
            // Handle error (e.g., notify the user, retry, etc.)
        }
    };

    const handleChange = async (e, indexToChange) => {
        e.preventDefault();

        // Extract the _id of the item you want to change
        const itemId = allItems[indexToChange]._id;
        const newCompleteValue = !allItems[indexToChange].Complete;

        try {
            // Define the API endpoint
            const apiUrl = import.meta.env.VITE_API_URL + `/${itemId}/complete`;

            // Send the PUT request with the new 'Complete' value
            await axios.put(apiUrl, { complete: newCompleteValue });

            // If the PUT request is successful, then update local state
            const newItems = allItems.map((item, index) => {
                if (index === indexToChange) {
                    return { ...item, Complete: newCompleteValue };
                }
                return item;
            });

            const sortedItems = newItems.sort((a, b) => {
                if (a.Complete === b.Complete) return 0;
                if (a.Complete) return 1;
                return -1;
            });

            setAllItems(sortedItems);
        } catch (error) {
            console.error("Error while updating item:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSubmit(e);
        }
    };

    return (
        <div className="main">
            <div className="Glass">
                <div className="top-div">
                    <label className="Title">Todo List</label>
                </div>
                <div className="bottom-div">
                    <form className="form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Add Item Here"
                            value={item.Title}
                            onChange={(e) =>
                                setItem({ ...item, Title: e.target.value })
                            }
                            onKeyDown={handleKeyDown}
                            required
                            className="textBar" // When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element
                        />
                        <button type="submit" className="btn">
                            <p>➤</p>
                        </button>
                    </form>
                    <div className="results">
                        {err && err}
                        {allItems.map((savedItem, index) => (
                            <div key={`link-${index}`} className="output">
                                <label
                                    className="itemValue"
                                    style={{
                                        backgroundColor: savedItem.Complete
                                            ? "lightgreen"
                                            : "white",
                                    }}>
                                    {savedItem.Title}
                                </label>
                                <button
                                    onClick={(e) => handleDelete(e, index)}
                                    className="btn">
                                    <p>🗑</p>
                                </button>
                                <button
                                    onClick={(e) => handleChange(e, index)}
                                    className="btn">
                                    <p>{savedItem.Complete ? "x" : "✓"}</p>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
