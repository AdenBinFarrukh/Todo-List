import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [item, setItem] = useState({
        title: "",
        complete: false,
    });
    const [allItems, setAllItems] = useState([]);

    // // Load data from localStorage on mount
    // useEffect(() => {
    //     const articlesFromLocalStorage = JSON.parse(
    //         localStorage.getItem("articles")
    //     );

    //     if (articlesFromLocalStorage) {
    //         setAllArticles(articlesFromLocalStorage);
    //     }
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setAllItems([...allItems, item]);
        setItem({ title: "", complete: false });
    };

    const handleDelete = async (e, indexToDelete) => {
        e.preventDefault();

        const newItems = allItems.filter(
            (item, index) => index !== indexToDelete
        );
        setAllItems(newItems);
    };

    const handleChange = async (e, indexToChange) => {
        e.preventDefault();

        const newItems = allItems.map((item, index) => {
            if (index === indexToChange) {
                return { title: item.title, complete: !item.complete };
            }
            return item;
        });

        const sortedItems = newItems.sort((a, b) => {
            if (a.complete === b.complete) return 0;
            if (a.complete) return 1;
            return -1;
        });

        setAllItems(sortedItems);
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
                            value={item.title}
                            onChange={(e) =>
                                setItem({ ...item, title: e.target.value })
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
                        {allItems.map((savedItem, index) => (
                            <div key={`link-${index}`} className="output">
                                <label
                                    className="itemValue"
                                    style={{
                                        backgroundColor: savedItem.complete
                                            ? "lightgreen"
                                            : "white",
                                    }}>
                                    {savedItem.title}
                                </label>
                                <button
                                    onClick={(e) => handleDelete(e, index)}
                                    className="btn">
                                    <p>🗑</p>
                                </button>
                                <button
                                    onClick={(e) => handleChange(e, index)}
                                    className="btn">
                                    <p>✓</p>
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
