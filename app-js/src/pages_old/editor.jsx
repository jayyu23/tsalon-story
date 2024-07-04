import axios from "axios";
import { React, useEffect, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import wordsCount from "words-count";
import auth from "../auth/authhandler";
import { extend, update } from "lodash";
import endpoints from "../auth/endpoints";
import TBookView from "../components/tbookview";

function TSalonEditor(props) {
  auth.protectRoute();

  const [currentTBSN, setCurrentTBSN] = useState(
    sessionStorage.getItem("draftTBSN")
  );

  const watermarkBlue = "assets/logo_circle.png";
  const watermarkGreen = "assets/logo_circle_green.png";
  const [watermark, setWatermark] = useState(watermarkBlue);
  const [greenTokens, setGreenTokens] = useState(0);

  const author = sessionStorage.getItem("username");

  if (!(author && currentTBSN)) {
    auth.redirectToError();
  }

  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    updateCanvas();
  }, [watermark]);

  useEffect(() => {
    setPublicationChoice();
  }, [greenTokens]);

  // on load
  useEffect(() => {
    let authData = auth.getPostAuthData();
    axios
      .post(endpoints.getGreenTokensAPI(), authData.body, authData.config)
      .then(
        (acc) => {
          console.log(acc.data);
          let greenTokensNum = acc.data.greenTokens;
          setGreenTokens(greenTokensNum);
          if (currentTBSN != 0) {
            // Get request and load content.
            let route = endpoints.getDraftAPI(currentTBSN);
            axios.post(route, authData.body, authData.config).then(
              (acc) => {
                let data = acc.data;
                document.getElementById("postTitle").value = data.title;
                document.getElementById("postBlurb").value = data.blurb;
                document.getElementById("img").src = data.coverImage;
                document.getElementById("pubMode").value = data.pubMode;
                editor.current.setContents(data.content);
                setGreenTokens(greenTokensNum);
                getBlurbWordCount();
              },
              (rej) => {
                console.log(rej);
              }
            );
          }
        },

        (rej) => {
          console.log(rej);
        }
      );
  }, []);

  const [previewHTML, setPreviewHTML] = useState("");

  const blurbLength = 100; // 100 words
  const minContent = 300; // min word count for content
  const maxContent = 3000; // max word count for content

  const defaultImages = ["aqua", "green", "purple", "orange", "yellow"];
  const defaultImgUrl = `assets/logo_square_${
    defaultImages[Math.floor(Math.random() * defaultImages.length)]
  }.png`;

  const [imgURL, setImgURL] = useState(currentTBSN == 0 ? defaultImgUrl : "");

  const getBlurbWordCount = () => {
    let currentText = document.getElementById("postBlurb").value;
    let currentLength = wordsCount(currentText, {
      disableDefaultPunctuation: true,
    });
    let blurbWordCount = document.getElementById("blurbWordCount");
    blurbWordCount.innerText =
      "Word Count: " + currentLength + "/" + blurbLength + " words";
    if (currentLength > blurbLength) {
      blurbWordCount.className = "text-danger mt-1";
      return false;
    } else {
      blurbWordCount.className = "text-muted mt-1";
      return true;
    }
  };

  const setPublicationChoice = () => {
    let selector = document.getElementById("pubMode");
    if (selector.value == "blue") {
      setWatermark(watermarkBlue);
    } else if (selector.value == "green") {
      if (greenTokens > 0) {
        setWatermark(watermarkGreen);
      } else {
        alert("Not enough Green Tokens.");
        selector.value = "blue";
      }
    }
  };

  const getContentWordCount = (content) => {
    let currentText = editor.current.getText();
    let currentLength = wordsCount(currentText, {
      disableDefaultPunctuation: true,
    });
    let wordCountDisplay = document.getElementById("wordCount");
    wordCountDisplay.innerHTML = "Word Count: " + currentLength;
    if (currentLength < minContent || currentLength > maxContent) {
      wordCountDisplay.className = "text-danger mt-0 mx-5";
    } else {
      wordCountDisplay.className = "text-muted mt-0 mx-5";
    }
    return currentLength;
  };

  const validateContentLength = () => {
    // Blurb Check
    let submitErrorMessage = document.getElementById("submitMessage");
    if (getBlurbWordCount()) {
      // Content Check
      let contentLength = getContentWordCount(null);
      if (contentLength < minContent || contentLength > maxContent) {
        submitErrorMessage.className = "text-danger mt-0 mx-5";
        submitErrorMessage.innerText = `Error - Content must be between ${minContent} to ${maxContent} words in length`;

        return false;
      } else {
        return true;
      }
    } else {
      submitErrorMessage.className = "text-danger mt-0 mx-5";
      submitErrorMessage.innerText = `Error - Blurb length must be under ${blurbLength} words`;
      return false;
    }
  };

  const getSubmitBody = () => {
    return {
      tbsn: currentTBSN,
      title: document.getElementById("postTitle").value,
      blurb: document.getElementById("postBlurb").value,
      author: author,
      content: editor.current.getContents(),
      coverImage: document.getElementById("imgCanvas").toDataURL(),
      pubMode: document.getElementById("pubMode").value,
    };
  };

  const submitPost = async () => {
    let apiURL = endpoints.getDraftSubmitAPI();
    let authData = auth.getPostAuthData();
    if (validateContentLength()) {
      let postBody = getSubmitBody();
      extend(postBody, authData.body);
      axios.post(apiURL, postBody, authData.config).then(
        (res) => {
          window.location.href = "/dashboard";
        },
        (rej) => {
          console.log(rej);
        }
      );
    }
  };

  const savePost = async () => {
    let apiURL = endpoints.getDraftSaveAPI();
    let authData = auth.getPostAuthData();
    let postBody = getSubmitBody();
    extend(postBody, authData.body);

    let submitMessage = document.getElementById("submitMessage");
    let saveDate = new Date();
    axios.post(apiURL, postBody, authData.config).then(
      (res) => {
        submitMessage.className = "text-success mt-0 mx-5";
        submitMessage.innerText =
          "Save Successful at " + saveDate.toLocaleString();
        let draftData = res.data.draft;
        setCurrentTBSN(draftData.tbsn);
      },
      (rej) => {
        submitMessage.className = "text-danger mt-0 mx-5";
      }
    );
  };

  const uploadImage = (event) => {
    let img = event.target.files[0];
    let binaryData = [];
    binaryData.push(img);
    let url = URL.createObjectURL(
      new Blob(binaryData, { type: "application/zip" })
    );
    setImgURL(url);
    setPublicationChoice("blue");
    updateCanvas();
  };

  const updateCanvas = async () => {
    let canvas = document.getElementById("imgCanvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
    ctx.imageSmoothingQuality = "high";
    let img = document.getElementById("img");
    ctx.drawImage(img, 0, 0, 300, 300);

    let watermarkImg = new Image();
    watermarkImg.onload = () => {
      ctx.drawImage(watermarkImg, 225, 225, 70, 70);
    };
    watermarkImg.src = watermark;

    // Draw a circle around
    // let coord = 225 + Math.floor((300 - 225) / 2) - 1;
    // ctx.beginPath();
    // ctx.arc(coord, coord, 30, 0, 2 * Math.PI, false);
    // ctx.stroke();
  };

  const generatePreview = async () => {
    let submitButton = document.getElementById("submitButton");
    submitButton.style.display = "none";
    setPreviewHTML("");

    await savePost();
    let view = <TBookView mode="draft" draftContent={getSubmitBody()} />;
    submitButton.style.display = "inline";
    let previewMessage = document.getElementById("previewMessage");
    setPreviewHTML(view);
    previewMessage.innerText = "Preview generated. Scroll down to view.";
    previewMessage.className = "text-success mt-0 mx-5";
  };

  const blueText = `Blue-Chip: Community-reviewed TBooks will require peer-reviewers to vote on your draft articles before publication as a publicly-collectible TBook NFT.
  This ensures publication quality and allows the output to be a curated set of writing. Readers and collectors are more likely to buy peer-reviewed articles. (Recommended)`;

  const greenText = `Green-Chip: Self-publication costs 1 Green Token. This allows you to bypass the peer-review process and directly publish as a publicly collectible TBook NFT. This means that you are able to
  start earning immediately. However, because these are not community-vetted pieces, readers and collectors may be less willing to read and collect these pieces.`;
  return (
    <div className="h-100">
      <div className="container h-100 mx-0 px-0 mt-3 w-100">
        <NavBar />
        <div className="row h-100 w-100">
          <div className="col-md-3 col-xs-12" style={{ minWidth: 100 }}>
            <Sidebar active={2} />
          </div>

          <div className="col-xs-12 col-md-9">
            <h1 className="my-5 pt-5 text-center">TSalon Editor</h1>
            <div className="form-group container-fluid px-5 py-4 row">
              <div className="col-xl-5">
                <h4 className="font-weight-normal">Image Cover</h4>
                <canvas id="imgCanvas" height="300" width="300"></canvas>
                <img
                  id="img"
                  src={imgURL}
                  alt="Cover Image"
                  height="300"
                  width="300"
                  onLoad={updateCanvas}
                  style={{ display: "none" }}
                />
                <input
                  id="imgUpload"
                  className="mt-1"
                  type="file"
                  accept="image/png image/jpeg"
                  onChange={uploadImage}
                />
                <p className="text-muted mb-3 mt-2">300x300 PNG</p>
              </div>
              <div className="col-xl-7">
                <h4 className="font-weight-normal">Title</h4>
                <input
                  id="postTitle"
                  className="form-control"
                  maxLength={50}
                  style={{ fontSize: 32, fontWeight: "bold" }}
                ></input>
                <h4 className="font-weight-normal mt-5">Blurb</h4>
                <textarea
                  id="postBlurb"
                  className="form-control"
                  rows="4"
                  onInput={getBlurbWordCount}
                ></textarea>
                <p id="blurbWordCount" className="text-muted mt-1">
                  Word Count: 0 /{blurbLength} words
                </p>
              </div>
            </div>

            {/* End of 2-col*/}
            <div className="px-5">
              <h4 className="my-4">Publication mode</h4>
              <select
                className="form-select form-select-lg my-3"
                id="pubMode"
                onChange={setPublicationChoice}
              >
                <option value="blue">Community Reviewed Blue-Chip</option>
                <option value="green">Self-Published Green-Chip</option>
              </select>

              <div className="card mt-0 mb-5">
                <p className="card-body mb-0">
                  <i className="fa fa-circle text-info"></i>
                  {"\t\t"} {blueText}
                </p>

                <p className="card-body my-0">
                  <i className="fa fa-circle text-success"></i> {"\t\t"}
                  {greenText}
                </p>
                <p>
                  <i className="fas fa-circle-half-stroke text-success mx-3"></i>
                  Green Tokens: {"\t\t"}
                  {greenTokens}
                </p>
              </div>

              <h4 className="font-weight-normal">Content</h4>
              <p className="text-muted mb-0 mt-1">
                Must be {minContent} - {maxContent} words
              </p>
              <SunEditor
                name="postContent"
                getSunEditorInstance={getSunEditorInstance}
                onChange={getContentWordCount}
                height="800px"
                width="100%"
                setDefaultStyle="font-family: Arial; font-size: 20px;"
                setOptions={{
                  buttonList: [
                    [
                      "formatBlock",
                      "paragraphStyle",
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "list",
                      "blockquote",
                      "align",
                      "font",
                      "fontColor",
                      "fontSize",
                      "undo",
                      "redo",
                    ],
                  ],
                }}
              />

              <p id="wordCount" className="text-muted mt-0 mx-5">
                Word Count: 0
              </p>
              <p id="submitMessage" className="text-danger mt-0 mx-5"></p>
              <p id="previewMessage" className="text-success mt-0 mx-5"></p>
            </div>
            <div className="row justify-content-center my-5">
              <button
                className="btn btn-primary col-3 mx-3"
                onClick={savePost}
                style={{ borderRadius: 25 }}
              >
                Save Draft
              </button>
              <button
                onClick={generatePreview}
                className="btn btn-warning col-3 mx-3"
                style={{ borderRadius: 25 }}
              >
                Preview
              </button>
            </div>
            <div className="card w-100">
              {previewHTML}
              <button
                id="submitButton"
                className="btn btn-success text-center m-auto mb-4 px-4"
                style={{ borderRadius: 25, display: "none" }}
                onClick={submitPost}
              >
                Submit Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TSalonEditor;
