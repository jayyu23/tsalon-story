import React, { Component } from "react";
import TBook from "./TBook";
import axios from "axios";
import endpoints from "../auth/endpoints";

interface Publication {
  tbsn?: string;
  title?: string;
  blurb?: string;
  author?: string;
  coverImage?: string;
}

interface TBookStoreState {
  publications: Publication[];
  searchQuery: string;
}

class TBookStore extends Component<{}, TBookStoreState> {
  constructor(props: {}) {
    super(props);
    this.state = { publications: [], searchQuery: "" };
  }

  componentDidMount() {
      axios.get(endpoints.getAllPubAPI()).then((response) => {
        this.setState({ publications: response.data });
      });

    const defaultPublications: Publication[] = [
        {
          tbsn: "1",
          title: "The Great Gatsby",
          blurb:
            "The Great Gatsby is a novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
          author: "F. Scott Fitzgerald",
          coverImage:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
        },
        {
          tbsn: "2",
          title: "The Lady of the Camelias",
          blurb:
            "The Lady of the Camellias is a novel by Alexandre Dumas fils, first published in 1848 and subsequently adapted for the stage. The Lady of the Camellias premiered at the Théâtre du Vaudeville in Paris, France on February 2, 1852.",
          author: "Alexandre Dumas fils",
          coverImage:
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1356093901i/16171265.jpg",
        },
        {
          tbsn: "3",
          title: "The Picture of Dorian Gray",
          blurb:
            "The Picture of Dorian Gray is a Gothic and philosophical novel by Oscar Wilde, first published complete in the July 1890 issue of Lippincott's Monthly Magazine. Fearing the story was indecent, the magazine's editor deleted roughly five hundred words before publication without Wilde's knowledge.",
        },
      ];

    this.setState({
    });
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  filterPublications = () => {
    const { publications, searchQuery } = this.state;
    return publications.filter(
      (publication) =>
        publication.tbsn?.toString().includes(searchQuery.toLowerCase()) ||
        publication.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        publication.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  render() {
    const filteredPublications = this.filterPublications();
    return (
      <div className='vw-100 vh-100 d-flex flex-column'>
        <h1 className="text-center pb-4 mt-5 pt-3">TBookstore</h1>
        <div className="row justify-content-center my-5">
          <input
            className="form-control w-50 px-4 py-3"
            type="text"
            placeholder="Search"
            style={{ fontSize: 32, borderRadius: 100 }}
            value={this.state.searchQuery}
            onChange={this.handleSearchChange}
          />
          <button
            className="btn btn-success mx-3"
            style={{ width: 100, borderRadius: 100 }}
          >
            <i className="fa-solid fa-search" style={{ fontSize: 20 }}></i>
          </button>
        </div>
        <div className="row justify-content-center p-3">
          {filteredPublications.map((data) => (
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