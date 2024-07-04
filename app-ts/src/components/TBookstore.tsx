import React, { Component } from "react";
import TBook from "./TBook";
import axios from "axios";
// import endpoints from "../auth/endpoints";

interface Publication {
  tbsn?: string;
  title?: string;
  blurb?: string;
  author?: string;
  coverImage?: string;
}

interface TBookStoreState {
  publications: Publication[];
}

class TBookStore extends Component<{}, TBookStoreState> {
  constructor(props: {}) {
    super(props);
    this.state = { publications: [] };
  }

  componentDidMount() {
    // axios.get(endpoints.getAllPubAPI()).then((response) => {
    //   this.setState({ publications: response.data });
    // });
    this.setState({ publications: [
      {
        tbsn: "1",
        title: "The Great Gatsby",
        blurb:
          "The Great Gatsby is a novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
        author: "F. Scott Fitzgerald",
        coverImage:
          "https://en.wikipedia.org/wiki/The_Great_Gatsby#/media/File:The_Great_Gatsby_Cover_1925_Retouched.jpg",
        },
        {
            tbsn: "2",
            title: "The Lady of the Camelias",
            blurb:
              "The Lady of the Camellias is a novel by Alexandre Dumas fils, first published in 1848 and subsequently adapted for the stage. The Lady of the Camellias premiered at the Théâtre du Vaudeville in Paris, France on February 2, 1852.",
            author: "Alexandre Dumas fils",
        }
    ] });
  }

  render() {
    return (
      <div>
        <h1 className="text-center pb-4 mt-5 pt-3">TBookstore</h1>
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
              // coverImage={data.coverImage}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default TBookStore;