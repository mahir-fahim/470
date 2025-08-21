import React from "react";
import UserDashboard from "../components/UserDashboard";
import BookSearch from "../components/BookSearch";

const MyLibraryPage = () => {
  return (
    <>
      <UserDashboard />
      <div style={{ marginTop: "40px" }}>
        <BookSearch />
      </div>
    </>
  );
};

export default MyLibraryPage;
