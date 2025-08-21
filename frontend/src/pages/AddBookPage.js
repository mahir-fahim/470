import React from "react";
import AddBook from "../components/AddBook";
import BookManager from "../components/BookManager";

const AddBookPage = () => {
  return (
    <>
      <AddBook />
      <div style={{ marginTop: "40px" }}>
        <BookManager />
      </div>
    </>
  );
};

export default AddBookPage;
