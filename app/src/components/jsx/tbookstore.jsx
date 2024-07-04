import React, { Component } from "react";
import TBook from "./tbook";
import axios from "axios";
import endpoints from "../../auth/endpoints";

class TBookStore extends Component {
  constructor(props) {
    super(props);
    this.state = { publications: [] };
  }
  componentDidMount() {
    axios.get(endpoints.getAllPubAPI()).then((pubs) => {
      this.setState({ publications: pubs.data });
    });
  }

  render() {
    return (
      <div>
        <h1 className="text-center pb-4">TBookstore</h1>
        <div className="row justify-content-center my-5">
          <input
            className="form-control w-50 px-4 py-3"
            type="text"
            placeholder="Search"
            style={{ fontSize: 32, borderRadius: 100 }}
          />
          <button
            className="btn btn-success mx-3"
            style={{ width: 100, borderRadius: 100 }}
          >
            <i className="fa-solid fa-search" style={{ fontSize: 20 }}></i>
          </button>
        </div>
        <div className="row justify-content-center p-3">
          {this.state.publications.map((data) => (
            <TBook
              tbsn={data.tbsn}
              key={data.tbsn}
              title={data.title}
              blurb={data.blurb}
              author={data.author}
              coverImage={data.coverImage}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default TBookStore;
