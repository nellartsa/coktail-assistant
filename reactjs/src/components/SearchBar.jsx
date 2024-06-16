import React, { useState } from "react";
import { searchIcon } from "../assets/icons";

const SearchBar = ({ onSearch }) => {
  const [userSearch, setUserSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(userSearch);
    setUserSearch("");
  };

  return (
    <form className="search relative" onSubmit={handleSubmit}>
      <input
        type="search"
        name="search"
        placeholder="Search our different cocktails!"
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        required
      />
      <button className="absolute flex" type="submit">
        {searchIcon}
      </button>
    </form>
  );
};

export default SearchBar;
