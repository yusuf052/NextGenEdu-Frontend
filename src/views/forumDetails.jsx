import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { decode } from "jwt-js-decode";
import VARIABLES from "../../environmentVariables";
import { formatDateTime } from "../utils/dateUtils";
import HotTodayQuestionTopic from "../components/forumHotTodayquestion";
import InstructorImg from "../assets/images/instructor-image-course.png";

import successfulImg from "../assets/images/successfullPosted.svg";

const ForumDetails = () => {
  const [questionUser, setQuestionUser] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);

  const [isAnswerBoxOpen, setIsAnswerBoxOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [user, setUser] = useState(null);

  const questionId = useParams().id;
  const handleViewedQuestion = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_REMOTE}/view-forum-question-id`,
        { questionId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 200) {
        setQuestionDetails(response.data.data);
        if (response.data.data.role === "student") {
          setQuestionUser(response.data.data.studentId);
        } else if (response.data.data.role === "teacher") {
          setQuestionUser(response.data.data.teacherId);
        }

        
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to viewed!!");
    }
  };

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_REMOTE}/add-forum-answer`,
        { questionId, answer },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 200) {
        toast.success("Answer Added Successfully");
        const successModal = document.getElementById("successfulModal");
        const bootstrapModal = new bootstrap.Modal(successModal);
        bootstrapModal.show();
        setAnswer("");
        handleAnswerBoxOpen();
        handleViewedQuestion();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to Add answer");
    }
  };
  const handleAnswerBoxOpen = () => {
    setIsAnswerBoxOpen(!isAnswerBoxOpen);
  };
  const handleInputChange = (e) => {
    setAnswer(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        toast.error("login first");
      }, 1000);
      window.location.href = "/login";
    } else if (token) {
      let jwt = decode(token);
      setUser(jwt.payload.user);
    }
    handleViewedQuestion();
  }, []);
  return (
    <div className="forum m-0 p-0 mt-5 pt-5 d-flex  justify-content-center ">
      <div className="container pt-5">
        <div className="row m-0 p-0">
          <div className="col-lg-8">
            {/**forum question */}
            <div className="forumQuestion row m-0 p-0 mt-2 mb-2 ">
              <div className="card p-3 m-0 d-flex flex-row">
                <div className="col-1 m-0 p-0">
                  <i className="fa-regular fa-thumbs-up fs-3 text-secondary m-0 p-0"></i>
                  <h3 className="m-0 p-0 mt-3">+1</h3>
                </div>
                <div className="col-11">
                  {questionDetails && (
                    <h3 className="m-0 p-0">{questionDetails.question}</h3>
                  )}
                  {questionDetails && (
                    <p className="m-0 p-0 mt-2">
                      {questionDetails.description}
                    </p>
                  )}

                  <div className="row m-0 p-0 mt-3">
                    {questionDetails &&
                      Array.isArray(questionDetails.tags) &&
                      questionDetails.tags.map((element, index) => (
                        <div
                          className="badge-items w-auto rounded-1 ms-0 m-2"
                          key={index}
                        >
                          <p className="m-0 p-1 fw-medium text-secondary">
                            {element}
                          </p>
                        </div>
                      ))}
                  </div>
                  <div className="w-auto m-0 p-0 d-flex mt-4 mt-lg-0 justify-content-end ">
                    <div className="d-flex flex-column justify-content-end ">
                      {questionUser && (
                        <p className="m-0 p-0 text-secondary w-auto">
                          {formatDateTime(questionDetails.createdAt)}
                        </p>
                      )}
                      {questionUser && (
                        <p
                          className="m-0 p-0 text-right w-auto"
                          style={{ color: "#00CBB8" }}
                        >
                          {questionUser.username}
                        </p>
                      )}{" "}
                    </div>
                    <div
                      className=" rounded-circle overflow-hidden w-auto m-0 p-0 ms-2"
                      style={{ backgroundColor: "#D9D9D9" }}
                    >
                      {questionUser && (
                        <img
                          src={
                            questionUser.profileImage
                              ? `${import.meta.env.VITE_API_URL_REMOTE}/uploads/${questionUser.profileImage}`
                              : InstructorImg
                          }
                          alt="instructor image"
                          className="instructorImg  rounded-circle"
                          style={{ height: "50px", width: "50px" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/** forum answer box */}
            {isAnswerBoxOpen ? (
              <div className="forumQuestion row m-0 p-0 mt-4 mb-2 ">
                <div className="card p-3 m-0">
                  <h5 className="m-0 p-0">{user.username}</h5>
                  <form
                    action="/add-answer"
                    onSubmit={handleAddAnswer}
                    method="post"
                  >
                    <div className="question-form col-lg-12 row m-0 p-0  mb-3 mt-3 position-relative ">
                      <textarea
                        type="text"
                        className="border border-1 rounded-2 p-2 ps-3 m-0 h-auto"
                        id="answer"
                        name="answer"
                        value={answer}
                        placeholder="write your reply here..."
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="row m-0 p-0 justify-content-end mt-3 mb-0">
                      <button
                        type="button"
                        className="btn btn-transparent w-auto border border-1 border-primary-subtle "
                        onClick={handleAnswerBoxOpen}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn text-light w-auto ms-3"
                        style={{ backgroundColor: "#49BBBD" }}
                        onClick={handleAddAnswer}
                      >
                        Post
                      </button>
                    </div>
                  </form>
                  {/* <!-- Successful Added question Modal --> */}
                  <div
                    className="modal fade"
                    id="successfulModal"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content p-3">
                        <div className="modal-header border-bottom-0">
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="row m-0 p-0 justify-content-center ">
                            <img
                              src={successfulImg}
                              alt=""
                              className=""
                              style={{ height: "150px", width: "150px" }}
                            />
                          </div>

                          <h3 className="m-0 p-0 text-center mt-3">
                            You successfully posted your Answer!
                          </h3>
                          <p className="m-0 p-0 text-secondary text-center mt-3 mb-3">
                            while you wait for the answers,feel free to browse
                            other questions
                          </p>
                        </div>
                        <div className="modal-footer border-top-0 justify-content-center ">
                          <button
                            type="button"
                            className="btn text-light"
                            data-bs-dismiss="modal"
                            style={{ backgroundColor: "#49BBBD" }}
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="row m-0 p-0 mt-5 justify-content-between ">
              {questionDetails && Array.isArray(questionDetails.answers) && (
                <h4 className="m-0 p-0 w-auto">
                  {questionDetails.answers.length} Answers
                </h4>
              )}
              <div className="col-8 d-flex justify-content-end m-0 p-0">
                <div className="col-4 p-0">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>choose the category</option>
                    <option value="1">Trending</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <button
                  className="ask-question btn text-light w-auto ms-3"
                  onClick={handleAnswerBoxOpen}
                >
                  Answer
                </button>
              </div>
            </div>

            {/** forum answer list */}
            <div className="row m-0 p-0 mt-3">
              {questionDetails &&
                Array.isArray(questionDetails.answers) &&
                questionDetails.answers.map((element) => (
                  <div className="forumQuestion row m-0 p-0 mt-2 mb-2 ">
                    <div className="card p-3 m-0 d-flex flex-row">
                      <div className="col-1 m-0 p-0">
                        <i className="fa-regular fa-thumbs-up fs-4 text-secondary m-0 p-0"></i>
                        <h5 className="m-0 p-0 mt-3">+1</h5>
                      </div>
                      <div className="col-11">
                        <p className="m-0 p-0 mt-2">{element.answer}</p>

                        <div className="w-auto m-0 p-0 d-flex mt-4 mt-lg-0 justify-content-end ">
                          <div className="d-flex flex-column justify-content-end ">
                            {questionUser && (
                              <p className="m-0 p-0 text-secondary w-auto">
                                {formatDateTime(element.updatedAt)}
                              </p>
                            )}
                            {questionUser && (
                              <p
                                className="m-0 p-0 text-right w-auto"
                                style={{ color: "#00CBB8" }}
                              >
                                {element.role === "student"
                                  ? `${element.studentId.username}`
                                  : `${element.teacherId.username}`}
                              </p>
                            )}{" "}
                          </div>
                          <div
                            className=" rounded-circle overflow-hidden w-auto m-0 p-0 ms-2"
                            style={{ backgroundColor: "#D9D9D9" }}
                          >
                            {element.role === "student" ? (
                              <img
                                src={
                                  element.studentId.profileImage
                                    ? `${import.meta.env.VITE_API_URL_REMOTE}/uploads/${element.studentId.profileImage}`
                                    : InstructorImg
                                }
                                alt="instructor image"
                                className="instructorImg  rounded-circle"
                                style={{ height: "50px", width: "50px" }}
                              />
                            ) : (
                              <img
                                src={
                                  element.teacherId.profileImage
                                    ? `${import.meta.env.VITE_API_URL_REMOTE}/uploads/${element.studentId.profileImage}`
                                    : InstructorImg
                                }
                                alt="instructor image"
                                className="instructorImg  rounded-circle"
                                style={{ height: "50px", width: "50px" }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/**Hot Today section is start */}
          <div className="col-lg-4 mt-5 mt-lg-0 pb-4 pb-lg-0">
            <h2 className="m-0 p-0 col-lg-11" style={{ color: "#2F327D" }}>
              Hot
              <span className="ps-2" style={{ color: "#00CBB8" }}>
                today
              </span>
            </h2>
            <div className="row m-0 p-0 mt-3">
              <HotTodayQuestionTopic />
              <HotTodayQuestionTopic />
              <HotTodayQuestionTopic />
              <HotTodayQuestionTopic />
              <HotTodayQuestionTopic />
              <HotTodayQuestionTopic />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetails;
