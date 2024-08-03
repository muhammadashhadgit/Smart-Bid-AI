import React from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import Timer from "./Timer";

const style = {
  position: "absolute",
  align: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Product(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const location = useLocation();
  const [prop, setProp] = React.useState(location.state);
  const [time, setTime] = React.useState(0);
  const [isActive, setActive] = React.useState(false);
  const userID = reactLocalStorage.get("userID");
  const [amount, setAmount] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  let navigate = useNavigate();

  function handleBid(e) {
    let new_amount = parseInt(e);
    setAmount(new_amount);
  }

  function isFormValid() {
    if (!userID) {
      setShowAlert(true);
      setAlertMessage("You need to be logged in to bid on a product");
      return false;
    }
    return true;
  }

  React.useEffect(() => {
    axios
      .post("http://localhost:8000/product/single/", { productID: prop._id })
      .then(function (res) {
        setTime(res.data.data);
        setActive(true);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      bidCost: prop.bid[prop.bid.length - 1].bidCost,
    },
    onSubmit: async (values) => {
      if (isFormValid() === true) {
        if (
          amount > prop.bid[prop.bid.length - 1].bidCost &&
          prop.bid.length >= 1
        ) {
          let userID = reactLocalStorage.get("userID");
          axios
            .post("http://localhost:8000/user/bidonproduct", {
              userID: userID,
              productID: prop._id,
              bidCost: amount,
            })
            .then(async function (response) {
              if (response.data.message === "success") {
                axios
                  .post("http://localhost:8000/user/updatehistory", {
                    id: userID,
                    productID: prop._id,
                  })
                  .then((response) => {
                    console.log(response);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                navigate("/");
              }
            })
            .catch(function (error) {
              console.log(error);
              setShowAlert(true);
              setAlertMessage(
                "Please make sure that you have sufficient funds in wallet and bid is greater than starting bid"
              );
            });
        } else {
          setShowAlert(true);
          setAlertMessage(
            "Incorrect amount entered, please bid over current bid"
          );
        }
      }
    },
  });

  return (
    <div
      className="container"
      style={{
        boxShadow:
          "0px 7px 8px -4px rgb(0 0 0 / 20%), 0px 12px 17px 2px rgb(0 0 0 / 14%), 0px 5px 22px 4px rgb(0 0 0 / 12%)",
        backgroundColor: "#eaeaea",
        width: "100%",
        padding: "2rem",
        marginTop: "5%",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            id="signup_form"
            onSubmit={formik.handleSubmit}
            style={{ textAlign: "center" }}
          >
            <h2 style={{ margin: "0 0 30px 0", textAlign: "left" }}>
              Place Bid
            </h2>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                name="bidCost"
                id="bidCost"
                placeholder={prop.bid[prop.bid.length - 1].bidCost}
                style={{ width: "100px", height: "40px" }}
              />
            </div>
            <Button
              type="submit"
              id="log"
              className="btn"
              style={{
                color: "white",
                backgroundColor: "#a7ac38",
                width: "100px",
                display: "block",
                margin: "30px auto",
              }}
            >
              BID
            </Button>
          </form>
        </Box>
      </Modal>
      <div className="row">
        <div className="col-12 col-md-5" style={{ padding: "2% 10%" }}>
          <div className="card" style={{ marginLeft: "-20%" }}>
            <img
              className="card-img-top"
              src={prop.image[0]}
              alt="Card"
              style={{
                height: "100%",
                width: "100%",
                minHeight: "40vh",
                minWidth: "60vh",
                border: "10px solid #afafaf",
                borderRadius: "0",
              }}
            />
          </div>
        </div>
        <div
          className="col-12 col-md-7"
          style={{ padding: "0 5%", textAlign: "left" }}
        >
          <div style={{ width: "100%" }}>
            <div className="card-body">
              <div className="card-text row">
                <h1
                  className="bold"
                  style={{
                    fontSize: "2em",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "90%",
                  }}
                >
                  {prop.name}
                </h1>
                <h3 style={{ fontSize: "1.5em" }}>
                  <b>Number of Bids:</b> {prop.bid.length - 1}
                </h3>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    textAlign: "justify",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    maxWidth: "90%",
                  }}
                >
                  <p className="mt-4" style={{ fontSize: "1.2em" }}>
                    <strong>Description :</strong>{" "}
                    <span>{prop.description}</span>
                  </p>
                </div>
                <p className="mt-4" style={{ fontSize: "1.2em" }}>
                  <b>Starting Bid :</b>{" "}
                  <b className="text-danger ">${prop.cost}</b>
                </p>
                <p className="mt-4" style={{ fontSize: "1.2em" }}>
                  <b>Current Bid :</b>{" "}
                  <b className="text-danger ">
                    ${prop.bid[prop.bid.length - 1].bidCost}
                  </b>
                </p>
                <div>
                  {isActive ? (
                    <Timer duration={time} />
                  ) : (
                    <h5>Timer loading</h5>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            {prop.userID === userID || props.check === "true" ? null : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  columnGap: "10px",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  data-cy="bid-input"
                  onChange={(e) => {
                    handleBid(e.target.value);
                  }}
                  name="bidCost"
                  id="bidCost"
                  placeholder="Enter Bid"
                  style={{
                    marginTop: "30px",
                    height: "40px",
                    fontSize: "15px",
                  }}
                />
                <Button
                  className="mt-5 btn"
                  data-cy="bid-button"
                  style={{
                    fontSize: "15px",
                    background: "#4BB543",
                    color: "white",
                    width: "100px",
                    height: "40px",
                  }}
                  variant="contained"
                  onClick={formik.handleSubmit}
                >
                  <b>Bid Now</b>
                </Button>
              </div>
            )}
          </div>
          {showAlert && (
            <div
              className="col"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              <strong
                style={{ fontSize: "1.2em", fontWeight: "bold", color: "red" }}
              >
                {alertMessage}
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
